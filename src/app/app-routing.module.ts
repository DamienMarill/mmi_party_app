import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LoginComponent as LoginLoginComponent } from './pages/login/login/login.component';
import {RegisterComponent} from './pages/login/register/register.component';
import {ForgetPassComponent} from './pages/login/forget-pass/forget-pass.component';
import {ResetPassComponent} from './pages/login/reset-pass/reset-pass.component';
import {ContentComponent} from './pages/content/content.component';
import {HomeComponent} from './pages/content/home/home.component';
import {CollectionComponent} from './pages/content/collection/collection.component';
import {CardComponent} from './pages/content/card/card.component';
import {LootComponent} from './pages/content/loot/loot.component';
import {authGuard, publicOnlyGuard} from './shared/guards/auth.guard';
import {SettingsComponent} from './pages/content/settings/settings.component';
import {GenerateCardsComponent} from './pages/admin/generate-cards/generate-cards.component';
import {TradeComponent} from './pages/content/trade/trade.component';
import {FightComponent} from './pages/content/fight/fight.component';
import {lootAvailableGuard} from './shared/guards/loot-available.guard';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [publicOnlyGuard],
    data: {nav: {showNav: false, showBack: false}},
    children: [
      {
        path: '',
        component: LoginLoginComponent,
      },
      {
        path: 'register',
        component: RegisterComponent,
      },
      {
        path: 'forgot-password',
        component: ForgetPassComponent,
        data: {nav: {showNav: false, showBack: true}},
      },
      {
        path: 'reset-password',
        component: ResetPassComponent,
      }
    ]
  },
  {
    path: '',
    component: ContentComponent,
    canActivate: [authGuard],
    data: {nav: {showNav: true, showBack: false}},
    children: [
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'settings',
        component: SettingsComponent,
        data: {nav: {showNav: false, showBack: true}},
      },
      {
        path: 'collection',
        component: CollectionComponent,
      },
      {
        path: 'card/:cardId',
        component: CardComponent,
        data: {nav: {showNav: false, showBack: true}}
      },
      {
        path: 'loot',
        component: LootComponent,
        data: {nav: {showNav: false, showBack: false}},
        canActivate: [lootAvailableGuard]
      },
      {
        path: 'trade',
        component: TradeComponent,
        data: {nav: {showNav: true, showBack: false}}
      },
      {
        path: 'fight',
        component: FightComponent,
        data: {nav: {showNav: true, showBack: false}}
      }
    ],
  },
  {
    path: '**',
    redirectTo: 'home',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
