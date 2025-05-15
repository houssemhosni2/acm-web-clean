import { Component, HostListener, OnInit } from '@angular/core';
import { ThemeOptions } from '../../../theme-options';
import { select } from '@angular-redux/store';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AppComponent } from '../../../app.component';
import { SharedService } from 'src/app/shared/shared.service';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { checkOfflineMode } from 'src/app/shared/utils';
import { faShieldAlt  } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {
  public extraParameter: any;
  faMoneyCheck = faShieldAlt;

  /**
   *
   * @param globals ThemeOptions
   * @param activatedRoute ActivatedRoute
   * @param translate TranslateService
   */
  constructor(public globals: ThemeOptions, public activatedRoute: ActivatedRoute, public translate: TranslateService,
    public pathSharedService: SharedService,
    public router: Router) {

  }

  @select('config') public config$: Observable<any>;
  public renewelLoanCondition = false;
  public newInnerWidth: number;
  public innerWidth: number;
  activeId = 'dashboardsMenu';

  toggleSidebar() {
    this.globals.toggleSidebar = !this.globals.toggleSidebar;
    this.globals.sidebarHover = !this.globals.toggleSidebar;
  }

  sidebarHover() {
    this.globals.sidebarHover = !this.globals.sidebarHover;
  }

  sidebarHoverMouseOut() {
    this.globals.sidebarHover = false;
  }

  sidebarHoverMouseIn() {
    this.globals.sidebarHover = true;
  }

  ngOnInit() {
    if (!checkOfflineMode()) {
      this.pathSharedService.getRenewalConditionStatus().then((data) => {
        this.renewelLoanCondition = data;
      });
    }

    setTimeout(() => {
      this.innerWidth = window.innerWidth;
      if (this.innerWidth < 1200) {
        this.globals.toggleSidebar = false;
      }
    });
    this.extraParameter = this.activatedRoute.snapshot.firstChild.data.extraParameter;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.newInnerWidth = event.target.innerWidth;

    if (this.newInnerWidth < 1200) {
      this.globals.toggleSidebar = true;
    } else {
      this.globals.toggleSidebar = false;
    }
  }

  getDirection() {
    return AppComponent.direction;
  }
  customerReset() {
    this.pathSharedService.setCustomer(null);
    this.router.navigate([AcmConstants.CUSTOMER_MANAGEMENT], { queryParams: { source: 'add-customer' } });
  }
  navigateToAml(source : string ) {
    // Reload the component by navigating to the same URL
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/acm/generic-wf-dashbord'], { queryParams: { source: source} });
    });
  }

  navigateToUnassignedGw() {
    // Reload the component by navigating to the same URL
    this.router.navigate(['acm/unassigned-wf'], { queryParams: { source: 'AML-STATUS' } });

  }

  addProspect() {
    this.pathSharedService.setCustomer(null);
    this.router.navigate([AcmConstants.ADD_PROSPECT], { queryParams: { source: 'add' } });
  }
}
