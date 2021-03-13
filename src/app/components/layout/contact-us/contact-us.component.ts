import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import emailjs, { EmailJSResponseStatus } from 'emailjs-com';
import { CommunityService } from 'src/app/services/community.service';

@Component({
  selector: 'contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss'],
})
export class ContactUsComponent {
  contactForm: FormGroup;

  constructor(private fb: FormBuilder, private _communityService: CommunityService) {
    this.createForm();
  }

  createForm() {
    this.contactForm = this.fb.group({
      fullname: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email, Validators.minLength(6)]],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  showMsg: boolean = false;

  public sendEmail(e: Event) {
    e.preventDefault();
    this._communityService.createFeedBack('user/feedback', this.contactForm.value).subscribe(response => {
      console.log(response)
    }, error => {
      console.log(error)
    }
    )

    emailjs
      .sendForm(
        'service_z30fjyd',
        'template_jopjbyo',
        e.target as HTMLFormElement,
        'user_wuif2HZJf7QQ3YJwquV1d'
      )
      .then(
        (result: EmailJSResponseStatus) => {
          this.showMsg = true;
          console.log(result.text);
        },
        (error) => {
          console.log(error.text);
        }
      );
  }
  isDark = false;
  ngDoCheck() {
    let theme = localStorage.getItem('Theme');
    console.log(theme);
    console.log(this.isDark);
    if (theme == 'Dark') {
      this.isDark = true;
      console.log(this.isDark);
    } else {
      this.isDark = false;
    }
  }

}
