import {Component} from '@angular/core';
import {select} from '@angular-redux/store';
import {Observable} from 'rxjs';
import {ConfigActions} from '../../ThemeOptions/store/config.actions';
import {ThemeOptions} from '../../theme-options';
import {animate, query, style, transition, trigger} from '@angular/animations';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-base-layout',
  templateUrl: './base-layout.component.html',
  animations: [
    trigger('architectUIAnimation', [
      transition('* <=> *', [
        query(':enter, :leave', [
          style({
            opacity: 0,
            display: 'flex',
            flex: '1',
            transform: 'translateY(-20px)',
            flexDirection: 'column'

          }),
        ]),
        query(':enter', [
          animate('100ms ease', style({opacity: 1, transform: 'translateY(0)'})),
        ]),

        query(':leave', [
          animate('100ms ease', style({opacity: 0, transform: 'translateY(-20px)'})),
        ], {optional: true})
      ]),
    ])
  ]
})

export class BaseLayoutComponent {

  @select('config') public config$: Observable<any>;

  /**
   *
   * @param globals ThemeOptions
   * @param configActions configActions
   * @param translate TranslateService
   */
  constructor(public globals: ThemeOptions, public configActions: ConfigActions, public translate: TranslateService) {
  }

  toggleSidebarMobile() {
    this.globals.toggleSidebarMobile = !this.globals.toggleSidebarMobile;
  }
}
