import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  standalone: true,
})
export class HighlightDirective {
  // اللون الأساسي اللي بنحطه من HTML: appHighlight="..."
  @Input('appHighlight') baseColor = 'lightyellow';

  // لون وقت الهوفر
  @Input() hoverColor = 'gold';

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    this.setBg(this.baseColor);
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    this.setBg(this.hoverColor);
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.setBg(this.baseColor);
  }

  private setBg(color: string) {
    this.renderer.setStyle(this.el.nativeElement, 'background-color', color);
    this.renderer.setStyle(this.el.nativeElement, 'padding', '8px');
    this.renderer.setStyle(this.el.nativeElement, 'border-radius', '8px');
  }
}