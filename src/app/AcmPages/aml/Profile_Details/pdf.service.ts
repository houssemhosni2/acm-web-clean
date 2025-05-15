import { Injectable, ComponentFactoryResolver, Injector, ApplicationRef, Renderer2, RendererFactory2 } from '@angular/core';
import { getDate } from 'date-fns';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { SharedService } from 'src/app/shared/shared.service';
import { DatePipe } from '@angular/common';
@Injectable({
  providedIn: 'root'
})
export class PdfService {
  private renderer: Renderer2;

  constructor(private resolver: ComponentFactoryResolver,
    private injector: Injector,
    private appRef: ApplicationRef,
    private rendererFactory: RendererFactory2,
    private sharedService: SharedService,public datePipe: DatePipe) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  async generatePDF(component: any) {
    
    const componentFactory = this.resolver.resolveComponentFactory(component);
    const componentRef = componentFactory.create(this.injector);
    this.appRef.attachView(componentRef.hostView);

    const domElement = (componentRef.hostView as any).rootNodes[0] as HTMLElement;

    document.body.appendChild(domElement);
    document.body.style.overflow = 'hidden';

    await new Promise((resolve) => {
      setTimeout(resolve,7000)
    });

    let today = new Date() ;
    let pdfFileName = "AML_"+this.sharedService.getCustomer().customerName+"_"+this.datePipe.transform(today, 'dd/MM/yyyy');

    html2canvas(domElement, {
      scrollY: -window.scrollY, useCORS: true, // Important for cross-origin images
      imageTimeout: 5000, // Give more time for images to load
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      let doc = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4'
      });
      let position = 0;
      doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      doc.save(pdfFileName);
    })
    .catch((error) => {
      
    });

    document.body.removeChild(domElement);
    document.body.style.overflow = 'auto';
  }



}
