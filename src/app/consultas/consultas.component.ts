import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DataGeneralService } from '../data-general.service';
import { NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-consultas',
  templateUrl: './consultas.component.html',
  styleUrls: ['./consultas.component.css']
})
export class ConsultasComponent implements OnInit {
  @Output() sendConsultas = new EventEmitter<any[]>();
  @Output() sendSubtotal = new EventEmitter<any>();

  form: FormGroup = new FormGroup({
    fecConsulta: new FormControl(''),
    horaConsulta: new FormControl(''),
    codConsulta: new FormControl(''),
    tipoConsulta: new FormControl(''),
    valorConsulta: new FormControl(''),
    tipoDx: new FormControl(''),
    dxPrincipal: new FormControl(''),
    dxRelacionado1: new FormControl(''),
    tipoDxConsulta: new FormControl('')

  });

  formModal: FormGroup = new FormGroup({
    fecConsulta: new FormControl(''),
    horaConsulta: new FormControl(''),
    codConsulta: new FormControl(''),
    tipoConsulta: new FormControl(''),
    valorConsulta: new FormControl(''),
    tipoDx: new FormControl(''),
    dxPrincipal: new FormControl(''),
    dxRelacionado1: new FormControl(''),
    tipoDxConsulta: new FormControl(''),
    id: new FormControl('')
  });
  currentDate = new Date().toISOString().substring(0, 10);
  currentTime = new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: false });
  consultas:any[] = [];
  lastId = 0;
  submitted = false;
  datosClinica: any[] = [];
  serviciosClinica: any[] = [];
  consultasClinica: any[] = [];
  dxClinica: any[] = [];
  documentoMedico = '';
  tipoDocumentoMedico = '';
  items = 0;
  totalValue = 0;
  valorOutput = 0;



  constructor(
    private formBuilder: FormBuilder,
    private dataGeneralService: DataGeneralService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      fecConsulta: [this.currentDate, [Validators.required]],
      horaConsulta: [this.currentTime, [Validators.required]],
      codConsulta: ['', [Validators.required]],
      tipoConsulta: ['334', []],
      valorConsulta: ['0', [Validators.required]],
      tipoDx: ['15', []],
      dxPrincipal: ['S025', [Validators.required]],
      dxRelacionado1: ['K040'],
      tipoDxConsulta: ['2', []]
    });
    this.dataGeneralService.getData().subscribe(data => {
      this.serviciosClinica = data.servicios;
      this.consultasClinica = data.consultas;
      this.dxClinica = data.diagnosticos;
    });
  }

  get f(): { [key: string]: AbstractControl } { return this.form.controls; }
  get g(): { [key: string]: AbstractControl } { return this.formModal.controls; }

  // Busca el médico de la consulta
  searchMD(cod:number): void {
    this.documentoMedico = "";
    this.tipoDocumentoMedico = "";

    const val = this.serviciosClinica.filter(servicio => servicio.codigo === cod);
    this.documentoMedico = val[0].medico.documento;
    this.tipoDocumentoMedico = val[0].medico.tipoDocumento;
  }

  // Busca el valor (costo) de la consulta
  searchValue(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;

    if(selectedValue == ""){
      this.form.value.valorConsulta = 0;
      this.valorOutput = 0;
      return;
    }
    const val = this.consultasClinica.filter(consulta => consulta.codigo === selectedValue);
    this.form.value.valorConsulta = val[0].precio;
    this.valorOutput = this.form.value.valorConsulta;
  }

  // Busca un elemento del arreglo de consultas por el id
  searchArray(id:number): any { return this.consultas.filter(consulta => consulta.id === id) }

  onSubmit(): void {
    this.submitted = true;

    if (this.form.invalid) { return; }

    this.searchMD(this.form.value.tipoConsulta);
    this.lastId++
    const newValueWithId = {
      ...this.form.value,
      documentoMedico: this.documentoMedico,
      tipoDocumentoMedico: this.tipoDocumentoMedico,
      id: this.lastId
    };
    this.consultas.push(newValueWithId);
    this.items = this.consultas.length;
    this.totalValue += Number(this.form.value.valorConsulta);
    this.sendConsultas.emit(this.consultas);
    this.sendSubtotal.emit(this.totalValue);
  }

  // Elimina una consulta del arreglo
  onRemove(id:number): void {
    this.submitted = false;
    let consultaSearch = this.searchArray(id);
    this.totalValue -= Number(consultaSearch[0].valorConsulta);

    this.consultas = this.consultas.filter(consulta => consulta.id !== id);
    this.items= this.consultas.length;

    this.sendSubtotal.emit(this.totalValue);
  }

  // Abre el modal de edición de la consulta
  openModal(content:any, id:number): void {
    this.submitted = false;

    this.modalService.open(content);

    let val = this.searchArray(id);

    this.formModal = this.formBuilder.group({
      fechaModal: [val[0].fecConsulta, [Validators.required]],
      horaModal: [val[0].horaConsulta, [Validators.required]],
      codigoModal: [val[0].codConsulta, [Validators.required]],
      tipoModal: [val[0].tipoConsulta, []],
      valorModal: [val[0].valorConsulta, [Validators.required, Validators.min(1)]],
      finalidadModal: [val[0].tipoDx, []],
      dxPpalModal: [val[0].dxPrincipal, [Validators.required]],
      dx1Modal: [val[0].dxRelacionado1, []],
      tipoDxModal: [val[0].tipoDxConsulta, []],
      id: [id]
    });

  }

  // Edita la consulta selecionada
  onEdit(): void {
    this.submitted = true;

    if (this.formModal.invalid) {
      return;
    }

    this.searchMD(this.formModal.value.tipoModal);

    this.consultas = this.consultas.map(consulta => {
      if (consulta.id === this.formModal.value.id) {
        this.totalValue -= Number(consulta.valorConsulta);
        this.totalValue += Number(this.formModal.value.valorModal);
        return {
          ...consulta,
          fecConsulta: this.formModal.value.fechaModal,
          horaConsulta: this.formModal.value.horaModal,
          codConsulta: this.formModal.value.codigoModal,
          tipoConsulta: this.formModal.value.tipoModal,
          valorConsulta: this.formModal.value.valorModal,
          tipoDx: this.formModal.value.finalidadModal,
          dxPrincipal: this.formModal.value.dxPpalModal,
          dxRelacionado1: this.formModal.value.dx1Modal,
          tipoDxConsulta: this.formModal.value.tipoDxModal,
          documentoMedico: this.documentoMedico,
          tipoDocumentoMedico: this.tipoDocumentoMedico
        };
      }
      return consulta;
    });

    this.sendConsultas.emit(this.consultas);
    this.sendSubtotal.emit(this.totalValue);

    this.modalService.dismissAll();
  }



}
