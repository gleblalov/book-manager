import {Directive, HostListener, Input} from "@angular/core";
import {MatRipple} from "@angular/material/core";

@Directive({
  selector: '[appRippleHover]',
  standalone: true,
})
export class RippleHoverDirective {
  @Input() matRipple!: MatRipple;

  @HostListener('mouseenter')
  onMouseEnter() {
    if (this.matRipple) {
      this.matRipple.launch({
        centered: true,
        persistent: true,
        animation: {
          enterDuration: 500,
          exitDuration: 400,
        },
      });
    }
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    if (this.matRipple) {
      this.matRipple.fadeOutAll();
    }
  }
}
