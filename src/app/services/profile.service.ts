import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';
import { IPaginationProfile, IProfile } from '../interfaces/profile.interface';
import { CheckService } from './check.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  http = inject(HttpClient);
  checkService = inject(CheckService);
  currentDate = new Date().toISOString().split('T')[0];
  pageSize: number = 10;
  currentPage: number = 1;

  getProfile(): Observable<IProfile[]> {
    return this.http.get<IProfile[]>(
      'https://raw.githubusercontent.com/LightOfTheSun/front-end-coding-task-db/master/db.json'
    );
  }

  getFilterProfiles(page: number): Observable<IPaginationProfile> {
    this.currentPage = page;
    return this.getProfile().pipe(
      switchMap((profiles) =>
        this.checkService.isChecked$.pipe(
          map((isChecked) => {
            let filteredProfiles = isChecked
              ? this.filterProfiles(profiles)
              : profiles;
            return {
              profiles: this.paginationProfiles(
                filteredProfiles,
                this.currentPage
              ),
              totalCount: isChecked
                ? this.filterProfiles(profiles).length
                : profiles.length,
              isChecked: isChecked,
            };
          })
        )
      )
    );
  }

  filterProfiles(profiles: IProfile[]): IProfile[] {
    return profiles.filter((profile) => {
      return (
        profile.actual_return_date > profile.return_date ||
        (profile.return_date < this.currentDate && !profile.actual_return_date)
      );
    });
  }

  paginationProfiles(profiles: IProfile[], currentPage: number): IProfile[] {
    const start = (currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return profiles.slice(start, end);
  }
}
