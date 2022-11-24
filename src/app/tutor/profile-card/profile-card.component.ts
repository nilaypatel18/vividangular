import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../shared/services';

@Component({
  selector: 'profile-card',
  templateUrl: './profile-card.html',
})
export class ProfileCardCustomComponent implements OnInit {
  @Input() user: any;
  @Output() afterUpload = new EventEmitter();
  avatarOptions: any = {};
  public userId: any;
  public urlAvatar: any;
  public currentUser: any;
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  handleUpload = (value) => {
    console.log(value)
  }

  ngOnInit() {
    this.userId = this.user && this.user._id ? this.user._id : null;

    this.avatarOptions = {
      url: this.urlAvatar,
      fileFieldName: 'avatar',
      onFinish: (resp) => {
        console.log(resp)
        this.user.avatarUrl = resp.data.url;
        this.afterUpload.emit(resp.data.avatar);
      },
    };
  }
}
