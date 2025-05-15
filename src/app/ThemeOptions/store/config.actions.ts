import {Injectable} from '@angular/core';
import {ArchitectUIState} from './index';
import {NgRedux} from '@angular-redux/store';
import { checkOfflineMode } from 'src/app/shared/utils';

@Injectable()
export class ConfigActions {
  static CONFIG_GET = 'CONFIG_GET';
  static CONFIG_UPDATE = 'CONFIG_UPDATE';

  constructor(
    public ngRedux: NgRedux<ArchitectUIState>,
  ) {

    let headerTheme = 'bg-vicious-stance text-lighter';
    if (checkOfflineMode()) {
      headerTheme = 'bg-danger text-lighter';
    }

    this.ngRedux.dispatch({
      type: ConfigActions.CONFIG_UPDATE,
      payload: {sidebarTheme: 'bg-vicious-stance text-lighter', headerTheme: headerTheme }
    });
  }

  getConfig() {
    this.ngRedux.dispatch({
      type: ConfigActions.CONFIG_GET,
    });
  }

  updateConfig(config): void {
    this.ngRedux.dispatch({
      type: ConfigActions.CONFIG_UPDATE,
      payload: config
    });
  }

}
