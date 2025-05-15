import {Component, HostBinding} from '@angular/core';
import {select} from '@angular-redux/store';
import {Observable} from 'rxjs';
import {ThemeOptions} from '../../../theme-options';
import {TranslateService} from '@ngx-translate/core';
import {FaIconLibrary} from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent {

  /**
   *
   * @param globals ThemeOptions
   * @param translate TranslateService
   * @param library FaIconLibrary
   */
  constructor(public globals: ThemeOptions, public translate: TranslateService, public library: FaIconLibrary) {
  }

  @HostBinding('class.isActive')
  get isActiveAsGetter() {
    return this.isActive;
  }

  isActive: boolean;

  @select('config') public config$: Observable<any>;

  toggleSidebarMobile() {
    this.globals.toggleSidebarMobile = !this.globals.toggleSidebarMobile;
  }

  toggleHeaderMobile() {
    this.globals.toggleHeaderMobile = !this.globals.toggleHeaderMobile;
  }

}
