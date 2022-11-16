import { Injectable } from '@angular/core';
import { RestangularModule, Restangular } from 'ngx-restangular';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class CourseService {
  constructor(private restangular: Restangular) {}

  create(params: any): Promise<any> {
    return this.restangular.all('courses').post(params).toPromise();
  }

  search(params: any): Promise<any> {
    return this.restangular.one('courses').get(params).toPromise();
  }

  findOne(id): Promise<any> {
    return this.restangular.one('courses', id).get().toPromise();
  }

  update(id, data): Promise<any> {
    return this.restangular.one('courses', id).customPUT(data).toPromise();
  }

  delete(id): Promise<any> {
    return this.restangular.one('courses', id).customDELETE().toPromise();
  }

  approve(id): Promise<any> {
    return this.restangular.one('courses', id).one('approve').customPOST().toPromise();
  }

  reject(id, data): Promise<any> {
    return this.restangular.one('courses', id).one('reject').customPOST(data).toPromise();
  }

  disable(id): Promise<any> {
    return this.restangular.one('courses', id).one('disable').customPOST().toPromise();
  }

  enable(id): Promise<any> {
    return this.restangular.one('courses', id).one('enable').customPOST().toPromise();
  }
}
