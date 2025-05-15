import {Component} from '@angular/core';
import {LoaderService} from './loader.service';
import {Subject} from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { checkOfflineMode } from '../../utils';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.sass']
})
export class LoaderComponent {
  color = 'primary';
  mode = 'indeterminate';
  value = 50;

  isLoading: Subject<boolean> = this.loaderService.isLoading;

  constructor(public loaderService: LoaderService) {
  }
  /**
   * Get Direction
   */
    getDirection() {
      return AppComponent.direction;
    }

  isOfflineModeEnabled() {
    return checkOfflineMode();
  }
}
