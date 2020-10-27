import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { IFileUpload } from 'app/interfaces';
import { Datos } from 'app/models/datos.model';
import { BaseService } from 'app/services/base.service';
import { ExcepcionesComponent } from 'app/utilerias/excepciones/excepciones.component';
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
} from '../../interfaces';
import * as moment from 'moment';
import { Store } from '@ngrx/store';
import { AppState } from 'app/store/app.states';
import { AsignaBreadcrumb } from 'app/store/actions/permisos.actions';


@Component({
  selector: 'app-ins-caja',
  templateUrl: './ins-caja.component.html',
  styleUrls: ['./ins-caja.component.scss'],
  providers: [CoalService]
})
export class InsCajaComponent implements OnInit {

  spinner = false;
  breadcrumb;
  fechaHoy;
  sucursalesList = [];

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

  primerosDatos = [];
  columns2: { caption: string; dataField: string; }[];
  claveModulo = 'app-ins-caja';
  modulo: any;

  constructor(
    public dialog: MatDialog,
    private store: Store<AppState>,
    private baseService: BaseService,
    private coalService: CoalService,
  ) {
    this.store.dispatch(new AsignaBreadcrumb({
      breadcrumb: null
    }));
    moment.locale();
    setInterval(() => {
      this.fechaHoy = moment().format('L, LTS')
    }, 1000)
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
    this.CargaSucursales();
  }

  Grid() {
    // this.toolbar = [];
    /*
   Columnas de la tabla
   */
    try {
      this.columns = [
        {
          caption: 'Recibo',
          dataField: 'recibo',
        },
        {
          caption: 'Fecha',
          dataField: 'fecha'
        },
        {
          caption: 'Factura',
          dataField: 'factura'
        },
        {
          caption: 'Ingresos totales',
          dataField: 'ingreso'
        },
        {
          caption: 'Ingresados hoy',
          dataField: 'ingresados'
        },
        {
          caption: 'Pendientes de ingresar',
          dataField: 'pendites'
        },
        {
          caption: 'Forma de pago',
          dataField: 'formaPago'
        }
      ];

      this.columns2 = [
        {
          caption: 'Recibo',
          dataField: 'recibo',
        },
        {
          caption: 'Fecha',
          dataField: 'fecha'
        },
        {
          caption: 'Factura',
          dataField: 'factura'
        },
        {
          caption: 'Importes',
          dataField: 'importes'
        }
      ];

      /*
      Parametros de Paginacion de Grit
      */
      const pageSizes = [];
      pageSizes.push('10', '25', '50', '100');

      /*
      Parametros de Exploracion
      */
      this.exportExcel = { enabled: false, fileName: 'Listado de clientes' };
      // ******************PARAMETROS DE COLUMNAS RESPONSIVAS EN CASO DE NO USAR HIDDING PRIORITY**************** */
      this.columnHiding = { hide: false };
      // ******************PARAMETROS DE PARA CHECKBOX**************** */
      this.Checkbox = { checkboxmode: 'multiple' };  // *desactivar con none*/
      // ******************PARAMETROS DE PARA EDITAR GRID**************** */
      this.Editing = { allowupdate: false }; // *cambiar a batch para editar varias celdas a la vez*/
      // ******************PARAMETROS DE PARA SELECCION DE COLUMNAS**************** */
      this.Columnchooser = { columnchooser: false };

      /*
      Parametros de Search
      */
      this.searchPanel = {};

      /*
      Parametros de Scroll
      */
      this.scroll = { mode: 'standard' };
    } catch (error) {
      this.Excepciones(error, 1);
    }
  }

  CargaSucursales() {
    this.spinner = true;
    this.coalService.getService('caja/GetSucursales').subscribe(
      (res: any) => {
        if (res.err) {
          this.Excepciones(res.err, 4);
        } else if (res.excepcion) {
          this.Excepciones(res.excepcion, 3);
        } else {
          this.sucursalesList = res.recordsets[0];
        }
        this.spinner = false
      }, (error: any) => {
        this.Excepciones(error, 2);
        this.spinner = false
      }
    )
  }

  CargaAnticipo(sucursal) {
    console.log(sucursal);
    
  }

  datosMessage(e) {

  }

  receiveMessage(e) {

  }

  Excepciones(pila, tipoExcepcion: number) {
    try {
      const dialogRef = this.dialog.open(ExcepcionesComponent, {
        width: '60%',
        data: {
          idTipoExcepcion: tipoExcepcion,
          idUsuario: 1,
          idOperacion: 1,
          idAplicacion: 1,
          moduloExcepcion: 'sel-usuario.component',
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
