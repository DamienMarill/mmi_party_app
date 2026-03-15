import {LOCALE_ID, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { LoginComponent as LoginLoginComponent } from './pages/login/login/login.component';
import { RegisterComponent } from './pages/login/register/register.component';
import { ForgetPassComponent } from './pages/login/forget-pass/forget-pass.component';
import { ResetPassComponent } from './pages/login/reset-pass/reset-pass.component';
import { MoodleSuccessComponent } from './pages/login/moodle-success/moodle-success.component';
import { MoodleErrorComponent } from './pages/login/moodle-error/moodle-error.component';
import { ContentComponent } from './pages/content/content.component';
import { HomeComponent } from './pages/content/home/home.component';
import { CollectionComponent } from './pages/content/collection/collection.component';
import { CardComponent } from './pages/content/card/card.component';
import { LootComponent } from './pages/content/loot/loot.component';
import { InputComponent } from './shared/layout/card/input/input.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule, registerLocaleData} from '@angular/common';
import {provideHttpClient} from '@angular/common/http';
import { NavbarComponent } from './shared/layout/navbar/navbar.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MmiiComponent } from './shared/layout/mmii/mmii.component';
import { MmiiEditorComponent } from './shared/layout/mmii-editor/mmii-editor.component';
import { MmiiCardComponent } from './shared/layout/mmii-card/mmii-card.component';
import { TetrisComponent } from './shared/layout/tetris/tetris.component';
import { StatElementComponent } from './shared/layout/stat-element/stat-element.component';
import { OrbeComponent } from './shared/layout/orbe/orbe.component';
import { SettingsComponent } from './pages/content/settings/settings.component';
import { AutoCropDirective } from './shared/directives/auto-crop.directive';
import { SoundDirective } from './shared/directives/sound.directive';
import { GenerateCardsComponent } from './pages/admin/generate-cards/generate-cards.component';
import { EditBgComponent } from './shared/layout/edit-bg/edit-bg.component';
import { BackgroundCirclesComponent } from './shared/layout/background-circles/background-circles.component';
import { SkillAllocationComponent } from './shared/layout/skill-allocation/skill-allocation.component';
import { TradeComponent } from './pages/content/trade/trade.component';
import { FightComponent } from './pages/content/fight/fight.component';
import localeFr from '@angular/common/locales/fr';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { CustomizeComponent } from './pages/content/customize/customize.component';
import { InfoComponent } from './pages/content/info/info.component';
import { StatsComponent } from './pages/content/stats/stats.component';
import { MmiiBuilderComponent } from './pages/mmii-builder/mmii-builder.component';
import { HubComponent } from './shared/layout/hub/hub.component';
import { InvitationCardComponent } from './shared/layout/hub/invitation-card.component';
import { PlayerListItemComponent } from './shared/layout/hub/player-list-item.component';
import { RecapComponent } from './pages/content/recap/recap.component';
import { TradeSelectionComponent } from './pages/content/trade/trade-selection/trade-selection.component';
import { TradeRoomComponent } from './pages/content/trade/trade-room/trade-room.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LoginLoginComponent,
    RegisterComponent,
    ForgetPassComponent,
    ResetPassComponent,
    MoodleSuccessComponent,
    MoodleErrorComponent,
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
    StatElementComponent,
    OrbeComponent,
    SettingsComponent,
    AutoCropDirective,
    GenerateCardsComponent,
    EditBgComponent,
    BackgroundCirclesComponent,
    SkillAllocationComponent,
    TradeComponent,
    FightComponent,
    CustomizeComponent,
    InfoComponent,
    StatsComponent,
    MmiiBuilderComponent,
    HubComponent,
    InvitationCardComponent,
    PlayerListItemComponent,
    TradeSelectionComponent,
    SoundDirective,
    RecapComponent,
    TradeRoomComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: true, // Should be environment.production ideally
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [
    provideHttpClient(),
    { provide: LOCALE_ID, useValue: 'fr-FR' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
