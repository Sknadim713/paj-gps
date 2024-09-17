import {
  AfterViewInit,
  Component,
  ElementRef,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MenuController, Platform } from '@ionic/angular';
import {
  menuController,
  AnimationBuilder,
  createAnimation,
  MenuI,
  Animation,
} from '@ionic/core';
import { Observable, Subscription, filter } from 'rxjs';
import { DrawerScreen } from '../types/drawer';
import { ApiserviceService } from '../apiservice.service';
export const revealAnimation: AnimationBuilder = (
  menu: MenuI,
  anims: Animation[]
) => {
  const openedX = menu.width * (menu.isEndSide ? -1 : 1) + 'px';
  const contentOpen = createAnimation()
    .addElement(menu.contentEl!)
    .fromTo('transform', 'translateX(0px)', `translateX(${openedX})`);

  return createAnimation()
    .duration(400)
    .addAnimation(contentOpen)
    .addAnimation(anims);
};

@Component({
  selector: 'app-drawer',
  templateUrl: './drawer.page.html',
  styleUrls: ['./drawer.page.scss'],
})
export class DrawerPage implements AfterViewInit {
  @ViewChild('userAvatar', { read: ElementRef })
  userAvatarRef?: ElementRef;
  @ViewChild('menuIcon', { read: ElementRef })
  menuIconRef?: ElementRef;
  @ViewChildren('drawerItemList', { read: ElementRef })
  drawerItemListRef?: QueryList<ElementRef>;

  appPages: DrawerScreen[] = [
    { name: 'Home', icon: 'home', url: '/menu/home' },
    {
      name: 'Help',
      icon: 'people-circle-sharp',
      isAsset: true,
      url: '/menu/help',
    },

  ];
  drawerWidth: number = 280;
  rowWidth: number = this.drawerWidth - 64;
  activeTab = 'Home';
  isSplitPane = false;
  routeChangeEvent?: Subscription;

  constructor(
    private router: Router,
    public platform: Platform,
    private menu: MenuController,
    private _ApiService: ApiserviceService
  ) {
    this.getAllcar()
    this.widthCalculations();

    this.platform.resize.subscribe(() => {
      this.widthCalculations();
      this.initDrawerAnimation();
    });
  }

  ngAfterViewInit() {
    this.initDrawerAnimation();
  }

  ionViewDidEnter() {
    const routerEvent = this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd)
    ) as Observable<NavigationEnd>;

    this.routeChangeEvent = routerEvent.subscribe((event) => {
      for (let i = 0; i < this.appPages.length; i++) {
        if (event.url === this.appPages[i].url) {
          this.activeTab = this.appPages[i].name;
        }
      }
    });
  }

  ionViewWillLeave() {
    this.routeChangeEvent?.unsubscribe();
  }

  widthCalculations() {
    const deviceWidth = this.platform.width();
    this.drawerWidth = deviceWidth * 0.75;
    if (deviceWidth > 992) {
      const splitPaneWidth = (deviceWidth * 28) / 100;
      this.rowWidth = splitPaneWidth - 64;
      this.isSplitPane = true;
    } else {
      this.rowWidth = this.drawerWidth - 64;
      this.isSplitPane = false;
    }
  }

  initDrawerAnimation() {
    const avatarAnim = createAnimation()
      .addElement(this.userAvatarRef?.nativeElement)
      .fromTo('transform', 'rotate(36deg) scale(0.8)', 'rotate(0deg) scale(1)');
    const drawerItems: Animation[] = [];
    const itemRefArray = this.drawerItemListRef?.toArray();
    for (const itemRef of itemRefArray!) {
      const element = itemRef.nativeElement;
      const drawerItemAnim = createAnimation()
        .addElement(element.querySelector('.drawerInnerItem'))
        .fromTo(
          'transform',
          `translateX(-${this.rowWidth}px)`,
          'translateX(0px)'
        );
      drawerItems.push(drawerItemAnim);
    }


    const menuElement = this.menuIconRef?.nativeElement;
    const iconAnim = createAnimation()
      .addElement(menuElement.querySelector('.menu__icon'))
      .fromTo(
        'transform',
        'translate(-50%, -50%)',
        'rotate(180.01deg) translate(50%, 50%)'
      );

    const line1Anim = createAnimation()
      .addElement(menuElement.querySelector('.menu__line--1'))
      .fromTo(
        'transform',
        'translate3d(0px, 0px, 0) rotate(0deg) scaleX(1.0)',
        'translate3d(6px, 2px, 0) rotate(45deg) scaleX(0.65)'
      );

    const line3Anim = createAnimation()
      .addElement(menuElement.querySelector('.menu__line--3'))
      .fromTo(
        'transform',
        'translate3d(0px, 0px, 0) rotate(0deg) scaleX(1.0)',
        'translate3d(6px, -2px, 0) rotate(-45deg) scaleX(0.65)'
      );
    const menuIconAnim = createAnimation()
      .addElement(menuElement)
      .fromTo(
        'transform',
        'translateX(0px)',
        `translateX(${this.drawerWidth}px)`
      )
      .addAnimation(iconAnim)
      .addAnimation(line1Anim)
      .addAnimation(line3Anim);

    menuController.registerAnimation('my-reveal', (menu: MenuI) =>
      revealAnimation(menu, [avatarAnim, ...drawerItems, menuIconAnim])
    );
  }

  onDrawerNavigate(page: DrawerScreen) {
    if (page.url) {
      this.activeTab = page.name;
    }
  }

  onMenuClick() {
    this.menu.toggle('main-menu');
  }
  devices: any[] = [];
  devicesId: any;

  getAllcar() {
    this._ApiService.device().subscribe((res: any) => {
      this.devices = res.success;
      this.devicesId = this.devices.map((device: any) => device.id);
    },
      error => console.log(error));
  }


  onDeviceSelect(device: any) {
    this.activeTab = device.name;
    this.router.navigate(['/map'], { state: { device } });
  }
}
