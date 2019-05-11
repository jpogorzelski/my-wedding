import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { errorRoute, navbarRoute } from './layouts';

const LAYOUT_ROUTES = [navbarRoute, ...errorRoute];

@NgModule({
    imports: [
        RouterModule.forRoot(
            [
                {
                    path: 'admin',
                    loadChildren: './admin/admin.module#MyWeddingAdminModule'
                },
                ...LAYOUT_ROUTES
            ],
            { useHash: true, enableTracing: false /*DEBUG_INFO_ENABLED*/ }
        )
    ],
    exports: [RouterModule]
})
export class MyWeddingAppRoutingModule {}
