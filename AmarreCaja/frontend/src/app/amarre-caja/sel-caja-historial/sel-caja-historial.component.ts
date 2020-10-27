import { Component, OnInit } from '@angular/core';
import { CoalService } from '../../services/coal.service';
import {
  IGridOptions,
  IColumns,
  IExportExcel,
  ISearchPanel,
  IScroll,
  Toolbar,
  IColumnHiding,
  ICheckbox,
  IEditing,
  IColumnchooser,
  TiposdeDato,
  TiposdeFormato

} from '../../interfaces';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BaseService } from '../../../app/services/base.service';
import { Datos } from '../../models/datos.model'
import { MatDialog } from '@angular/material/dialog';
import { ExcepcionesComponent } from '../../../app/utilerias/excepciones/excepciones.component';
import { AsignaBreadcrumb } from 'app/store/actions/permisos.actions';
import { Store } from '@ngrx/store';
import { AppState } from 'app/store/app.states';
import { AlertDialogComponent } from 'app/utilerias/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-sel-caja-historial',
  templateUrl: './sel-caja-historial.component.html',
  styleUrls: ['./sel-caja-historial.component.scss'],
  providers: [CoalService]
})
export class SelCajaHistorialComponent implements OnInit {
  claveModulo = 'app-sel-caja-historial';
  caja = [];

  // Grid variables
  gridOptions: IGridOptions;
  columns: IColumns[];
  exportExcel: IExportExcel;
  searchPanel: ISearchPanel;
  scroll: IScroll;
  toolbar: Toolbar[];
  columnHiding: IColumnHiding;
  Checkbox: ICheckbox;
  Editing: IEditing;
  Columnchooser: IColumnchooser;

  evento: string;
  datosevent: any;
  modulo: any;
  breadcrumb: any;
  spinner = false;

  distribuidores = [];
  fecha: string;
  historialCaja = [];

  constructor(
    public dialog: MatDialog,
    private coalService: CoalService,
    private baseService: BaseService,
    private router: Router,
    private store: Store<AppState>
  ) {
    this.store.dispatch(new AsignaBreadcrumb({
      breadcrumb: null
    }));
  }

  ngOnInit() {
    const getStateUser = this.baseService.getUserData();
    this.modulo = Datos.GetModulo(this.claveModulo, getStateUser.permissions.modules);
    if (this.modulo.breadcrumb) {
      this.breadcrumb = Datos.GetConfiguracionBreadCrumb(this.modulo.breadcrumb);
      this.store.dispatch(new AsignaBreadcrumb({
        breadcrumb: this.breadcrumb
      }));
    }
    this.Grid();
    this.LoadData()
  }

  receiveMessage($event) {
    try {
      this.evento = $event.event;
      if ($event === 'ver') {
        this.verCaja();
      }else if ($event === 'crear'){
        this.crearCaja();
      }
    } catch (error) {
      this.Excepciones(error, 1);
    }
  }

  crearCaja() {
    this.router.navigateByUrl('/ins-caja');

  }

  /**
  * @description Obtenemos la data del componente 'grid-component'
  * @param $event Data del 'grid-component'
  * @returns Data en formato Json
  * @author Antonio GUerra
  */
  datosMessage($event) {
    try {
      this.datosevent = $event.data;
    } catch (error) {
      this.Excepciones(error, 1);
    }
  }

  Alerta() {
    this.AlertDialog('Por favor de verificar');
  }


  AlertDialog(message: string) {
    try {
      const dialogRef = this.dialog.open(AlertDialogComponent, {
        width: '500px',
        data: {
          message
        }
      });

      dialogRef.afterClosed().subscribe((result: any) => { });
    } catch (error) {
      this.Excepciones(error, 1);
    }
  }

  Grid() {
    this.toolbar = [];
    /*
   Columnas de la tabla
   */
    try {
      this.columns = [
        {
          caption: 'Sucursal',
          dataField: 'sucursal',
        },
        {
          caption: 'Fecha',
          dataField: 'fecha',
          dataType: TiposdeDato.date,
          format: TiposdeFormato.longDate
        },
        {
          caption: 'Total banco',
          dataField: 'totalBanco',
          format: TiposdeFormato.moneda
        },
        {
          caption: 'Total a depositar',
          dataField: 'totalDepositar',
          format: TiposdeFormato.moneda
        },
        {
          caption: 'Saldo contable final',
          dataField: 'saldoFinal',
          format: TiposdeFormato.moneda
        },
        {
          caption: 'Diferencia',
          dataField: 'diferencia',
          format: TiposdeFormato.moneda
        },
        {
          caption: 'Importes por contablizar',
          dataField: 'importe',
          format: TiposdeFormato.moneda
        }
      ];

      /*
      Parametros de Paginacion de Grit
      */
      const pageSizes = ['10', '25', '50', '100'];

      /*
      Parametros de Exploracion
      */
      this.exportExcel = { enabled: true, fileName: 'Listado de caja' };
      // ******************PARAMETROS DE COLUMNAS RESPONSIVAS EN CASO DE NO USAR HIDDING PRIORITY**************** */
      this.columnHiding = { hide: true };
      // ******************PARAMETROS DE PARA CHECKBOX**************** */
      this.Checkbox = { checkboxmode: 'multiple' };  // *desactivar con none*/
      // ******************PARAMETROS DE PARA EDITAR GRID**************** */
      this.Editing = { allowupdate: false }; // *cambiar a batch para editar varias celdas a la vez*/
      // ******************PARAMETROS DE PARA SELECCION DE COLUMNAS**************** */
      this.Columnchooser = { columnchooser: true };

      /*
      Parametros de Search
      */
      this.searchPanel = {
        visible: true,
        width: 200,
        placeholder: 'Buscar...',
        filterRow: true
      };

      /*
      Parametros de Scroll
      */
      this.scroll = { mode: 'standard' };

      if (this.modulo.camposClase.find(x => x.nombre === 'verCaja')) {
        this.toolbar.push(
          {
            location: 'after',
            widget: 'dxButton',
            locateInMenu: 'auto',
            options: {
              width: 90,
              text: 'Ver',
              onClick: this.receiveMessage.bind(this, 'ver')
            },
            visible: true
          }
        );
      }

      if (this.modulo.camposClase.find(x => x.nombre === 'crearCaja')) {
        this.toolbar.push(
          {
            location: 'after',
            widget: 'dxButton',
            locateInMenu: 'auto',
            options: {
              width: 90,
              text: 'Crear',
              onClick: this.receiveMessage.bind(this, 'crear')
            },
            visible: true
          }
        );
      }

    } catch (error) {
      this.Excepciones(error, 1);
    }
  }

  LoadData() {
    this.spinner = true;
    this.coalService.getService(`caja/GetHistorialCaja`).subscribe(
      (res: any) => {
        if (res.err) {
          this.Excepciones(res.err, 4);
        } else if (res.excepcion) {
          this.Excepciones(res.excepcion, 3);
        } else {
          this.historialCaja = res.recordsets[0];
        }
        this.spinner = false
      }, (error: any) => {
        this.Excepciones(error, 2);
        this.spinner = false
      }
    )
  }

  verCaja() {
    this.router.navigateByUrl('/ins-caja');
  }

  change(e){

  }

  validaFecha(e){

  }

  /**
   * En caso de que algun metodo, consulta a la base de datos o conexión con el servidor falle, se abrira el dialog de excepciones
   * @param pila stack
   * @param tipoExcepcion numero de la escecpción lanzada
   */
  Excepciones(pila, tipoExcepcion: number) {
    try {
      const dialogRef = this.dialog.open(ExcepcionesComponent, {
        width: '60%',
        data: {
          idTipoExcepcion: tipoExcepcion,
          idUsuario: 1,
          idOperacion: 1,
          idAplicacion: 1,
          moduloExcepcion: 'sel-caja-historial.component',
          mensajeExcepcion: '',
          stack: pila
        }
      });
      dialogRef.afterClosed().subscribe((result: any) => { });
    } catch (error) {
      console.error(error);
    }
  }

}
