import { NgModule }               from '@angular/core';
import { Routes, RouterModule }   from '@angular/router';

import { CoreComponent }          from './core/core.component';
import { AppComponent }           from './app.component';
import { UsersComponent }         from './users/users.component';
import { UserProfileComponent }   from './user-profile/user-profile.component';
import { OtherUserComponent }     from './other-user/other-user.component';
import { GameDetailsComponent }   from './game-details/game-details.component'
import { GamesListComponent }   from './games-list/games-list.component'


import { AuthGuard } from './guards/auth.guard';

export const router: Routes = [
	{ path: '', redirectTo: '/main', pathMatch:'full'},
	{ path: 'main', component: CoreComponent },
	{ path: 'register', component: UsersComponent},
	{ path: 'user-games', component: UserProfileComponent, canActivate: [AuthGuard]},
	{ path: 'users/:_id', component: OtherUserComponent },
	{ path: 'games/:_id', component: GameDetailsComponent },
	{ path: 'search-results', component: GamesListComponent },
	{ path: 'games', component: GamesListComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(router)],
  exports: [RouterModule]
})
export class RoutingModule {}
