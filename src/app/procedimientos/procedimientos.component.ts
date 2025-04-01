import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataGeneralService } from '../data-general.service';
import { NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-procedimientos',
  templateUrl: './procedimientos.component.html',
  styleUrls: ['./procedimientos.component.css']
})
export class ProcedimientosComponent implements OnInit {
  @Output() sendProcedimientos = new EventEmitter<any[]>();
  @Output() sendSubtotal = new EventEmitter<any>();

  form: FormGroup = new FormGroup({
    fecha: new FormGroup(""),
    hora: new FormGroup(""),
    codigo: new FormGroup(""),
    tipoProcedimiento: new FormGroup(""),
    tipoDx: new FormGroup(""),
    viaIngreso: new FormGroup(""),
    valor: new FormGroup("")
  });

  formModal: FormGroup = new FormGroup({
    fechaModal: new FormGroup(""),
    horaModal: new FormGroup(""),
    codigoModal: new FormGroup(""),
    tipoModal: new FormGroup(""),
    finalidadModal: new FormGroup(""),
    viaModal: new FormGroup(""),
    valorModal: new FormGroup("")
  });

  currentDate = new Date().toISOString().substring(0, 10);
  currentTime = new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: false });
  procedimientos:any[] = [];
  lastId = 0;
  submitted = false;
  datosClinica: any[] = [];
  serviciosClinica: any[] = [];
  procedimientosClinica: any[] = [];
  dxClinica: any[] = [];
  documentoMedico = '';
  tipoDocumentoMedico = '';
  items = 0;
  totalValue = 0;

  constructor(
    private formBuilder: FormBuilder,
    private dataGeneralService: DataGeneralService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      fecha: [this.currentDate, [Validators.required]],
      hora: [this.currentTime, [Validators.required]],
      codigo: ['', [Validators.required]],
      tipoProcedimiento: ['334', []],
      tipoDx: ['15', []],
      viaIngreso: ['02', [Validators.required]],
      dxPrincipal: ['S025', [Validators.required]],
      dxRelacionado1: ['K040', [Validators.required]],
      valor: ['0', [Validators.required, Validators.min(1)]]
    });
    this.dataGeneralService.getData().subscribe(data => {
      this.serviciosClinica = data.servicios;
      this.dxClinica = data.diagnosticos;
    });
  }

  get f(): { [key: string]: AbstractControl } { return this.form.controls; }
  get g(): { [key: string]: AbstractControl } { return this.formModal.controls; }

  // Busca el médico del procedimiento
  searchMD(cod:number): void {
    this.documentoMedico = "";
    this.tipoDocumentoMedico = "";

    const val = this.serviciosClinica.filter(servicio => servicio.codigo === cod);
    this.documentoMedico = val[0].medico.documento;
    this.tipoDocumentoMedico = val[0].medico.tipoDocumento;
  }

  // Busca un elemento del arreglo de procedimientos por el id
  searchArray(id:number): any { return this.procedimientos.filter(procedimiento => procedimiento.id === id) }

  onSubmit(): void {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    this.searchMD(this.form.value.tipoProcedimiento);
    this.lastId++
    this.totalValue += Number(this.form.value.valor);
    const newValueWithId = {
      ...this.form.value,
      documentoMedico: this.documentoMedico,
      tipoDocumentoMedico: this.tipoDocumentoMedico,
      id: this.lastId
    };
    this.procedimientos.push(newValueWithId);
    this.items= this.procedimientos.length;
    this.sendProcedimientos.emit(this.procedimientos);
    this.sendSubtotal.emit(this.totalValue);
  }

  // Elimina un procedimiento del arreglo
  onRemove(id:number): void {
    this.submitted = false;
    let tmp = this.searchArray(id);
    this.procedimientos = this.procedimientos.filter(procedimiento => procedimiento.id !== id)
    this.items= this.procedimientos.length;
    this.sendProcedimientos.emit(this.procedimientos);
    this.totalValue -= Number(tmp[0].valor);
    this.sendSubtotal.emit(this.totalValue);
  }

  // Abre el modal de edición del procedimiento
  openModal(content:any, id:number): void {
    this.submitted = false;

    this.modalService.open(content);

    let val = this.searchArray(id);

    this.formModal = this.formBuilder.group({
      fechaModal: [val[0].fecha, [Validators.required]],
      horaModal: [val[0].hora, [Validators.required]],
      codigoModal: [val[0].codigo, [Validators.required]],
      tipoModal: [val[0].tipoProcedimiento, []],
      finalidadModal: [val[0].tipoDx, []],
      viaModal: [val[0].viaIngreso, []],
      valorModal: [val[0].valor, [Validators.required, Validators.min(1)]],
      dxPpal: ['S025', []],
      dx1Modal: ['K040', []],
      id: [id]
    });
  }

  onEdit(): void {
    this.submitted = true;

    if (this.formModal.invalid) {
      return;
    }

    this.searchMD(this.formModal.value.tipoModal);

    this.procedimientos = this.procedimientos.map(proc => {
      if (proc.id === this.formModal.value.id) {
        this.totalValue -= Number(proc.valor);
        this.totalValue += Number(this.formModal.value.valorModal);
        return {
          ...proc,
          fecha: this.formModal.value.fechaModal,
          hora: this.formModal.value.horaModal,
          codigo: this.formModal.value.codigoModal,
          tipoProcedimiento: this.formModal.value.tipoModal,
          tipoDx: this.formModal.value.finalidadModal,
          viaIngreso: this.formModal.value.viaModal,
          valor: this.formModal.value.valorModal,
          documentoMedico: this.documentoMedico,
          tipoDocumentoMedico: this.tipoDocumentoMedico
        }
      }
      return proc;
    });

    this.sendProcedimientos.emit(this.procedimientos);
    this.sendSubtotal.emit(this.totalValue);

    this.modalService.dismissAll();
  }

}
