import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ConsultasComponent } from './consultas/consultas.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RipsJsonComponent } from './rips-json/rips-json.component';
import { HttpClientModule } from '@angular/common/http';
import { CiudadesService } from './ciudades.service';
import { DataGeneralService } from './data-general.service';
import { ProcedimientosComponent } from './procedimientos/procedimientos.component';
import { OtrosServiciosComponent } from './otros-servicios/otros-servicios.component';


@NgModule({
  declarations: [
    AppComponent,
    ConsultasComponent,
    RipsJsonComponent,
    ProcedimientosComponent,
    OtrosServiciosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    BrowserAnimationsModule,
    HttpClientModule
  ],
  providers: [CiudadesService, DataGeneralService],
  bootstrap: [AppComponent]
})
export class AppModule { }
