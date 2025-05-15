import {Component} from '@angular/core';
import {ConfigActions} from '../store/config.actions';
import {ThemeOptions} from '../../theme-options';
import {FaIconLibrary} from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-options-drawer',
  templateUrl: './options-drawer.component.html',
})
export class OptionsDrawerComponent {

  /**
   * constructor Options Drawer Component
   * @param globals ThemeOptions
   * @param configActions ConfigActions
   * @param library FaIconLibrary
   */
  constructor(public globals: ThemeOptions,
              public configActions: ConfigActions, public library: FaIconLibrary) {
  }

  toggleOptionsDrawer() {
    this.globals.toggleThemeOptions = !this.globals.toggleThemeOptions;
  }

  toggleFixedFooter() {
    this.globals.toggleFixedFooter = !this.globals.toggleFixedFooter;
  }

}
