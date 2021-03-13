import { Component, OnInit } from '@angular/core';
import { CommunityService } from 'app/services/community.service';
import { Contact } from './../models/contact';

@Component({
  selector: 'app-contact-table',
  templateUrl: './contact-table.component.html',
  styleUrls: ['./contact-table.component.css']
})
export class ContactTableComponent implements OnInit {

  contacts: Contact[] = [];
  beforSearch: Contact[] = [];
  isResponsDone = false;
  constructor(private _communityService: CommunityService) { }

  ngOnInit() {
    // get all comments
    this._communityService.getAll('user/get-feedback-messages').subscribe(
      response => {
        this.isResponsDone = true;
        this.contacts = response["Data"];
        this.beforSearch = response["Data"];

        console.log(this.contacts);

      })

  }
  stringAsDate(dateStr: string) {
    return new Date(dateStr);
  }
  //delete comment
  deleteContact(contactID, email, index) {
    let isConfirmed = confirm(`Are u sure that u want to delete this message which was Written by ${email} ?`);
    if (isConfirmed) {
      this._communityService.delete(`user/feedback/${contactID}`)
        .subscribe(response => {
          console.log(response);
          this.contacts.splice(index, 1)
          // this.beforSearch.splice(index, 1);
        }, error => {
          console.log(error)
        }

        )
    }
  }
  search(event) {

    if (event.target.value.length == 0) {
      return this.contacts = this.beforSearch;

    }
    else {
      this.contacts = this.contacts.filter((contact, index) => {
        if ((contact.message.includes(event.target.value)) || (contact.fullname.includes(event.target.value)) || (contact.email.includes(event.target.value))) {
          return this.contacts[index];
        }

      })
    }


  }

}
