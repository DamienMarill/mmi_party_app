import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { LoginComponent as LoginLoginComponent } from './pages/login/login/login.component';
import { RegisterComponent } from './pages/login/register/register.component';
import { ForgetPassComponent } from './pages/login/forget-pass/forget-pass.component';
import { ResetPassComponent } from './pages/login/reset-pass/reset-pass.component';
import { ContentComponent } from './pages/content/content.component';
import { HomeComponent } from './pages/content/home/home.component';
import { CollectionComponent } from './pages/content/collection/collection.component';
import { CardComponent } from './pages/content/card/card.component';
import { LootComponent } from './pages/content/loot/loot.component';
import { InputComponent } from './shared/layout/card/input/input.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {provideHttpClient} from '@angular/common/http';
import { NavbarComponent } from './shared/layout/navbar/navbar.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MmiiComponent } from './shared/layout/mmii/mmii.component';
import { MmiiEditorComponent } from './shared/layout/mmii-editor/mmii-editor.component';
import { MmiiCardComponent } from './shared/layout/mmii-card/mmii-card.component';
import { TetrisComponent } from './shared/layout/tetris/tetris.component';
import { StatElementComponent } from './shared/layout/stat-element/stat-element.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LoginLoginComponent,
    RegisterComponent,
    ForgetPassComponent,
    ResetPassComponent,
    ContentComponent,
    HomeComponent,
    CollectionComponent,
    CardComponent,
    LootComponent,
    InputComponent,
    NavbarComponent,
    MmiiComponent,
    MmiiEditorComponent,
    MmiiCardComponent,
    TetrisComponent,
    StatElementComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule
  ],
  providers: [
    provideHttpClient()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
