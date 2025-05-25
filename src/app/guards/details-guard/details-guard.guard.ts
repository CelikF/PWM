import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { DataService } from 'src/app/services/data-access/data.service';


export const DetailsGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const eventId = route.paramMap.get('eventId');
  const auth = inject(AuthService);
  const dataService = inject(DataService);
  const router = inject(Router);

  if (!eventId) return of(router.createUrlTree(['/home']));

  return auth.user$.pipe(
    switchMap(user => {
      if (!user) return of(router.createUrlTree(['/login']));

      return dataService.getEventOnce(eventId).then(async (event) => {
        if (!event) return router.createUrlTree(['/home']);
        if (event.host_id === user.id) return true;

        const attendees = await dataService.getAttendeesOnce(eventId);
        const isInvited = attendees.some(a => a.id === user.id);
        return isInvited ? true : router.createUrlTree(['/home']);
      });
    })
  );
};