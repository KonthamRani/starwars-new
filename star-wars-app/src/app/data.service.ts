import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private apiUrls = {
    people: 'https://swapi.dev/api/people/',
    planets: 'https://swapi.dev/api/planets/',
    films: 'https://swapi.dev/api/films/',
    species: 'https://swapi.dev/api/species/',
    vehicles: 'https://swapi.dev/api/vehicles/',
    starships: 'https://swapi.dev/api/starships/',
  };

  constructor(private http: HttpClient) {}

  getPeople(): Observable<any> {
    return this.http.get(this.apiUrls.people);
  }
  getPerson(id:any):Observable<any>{
    return this.http.get(this.apiUrls.people+id);
    
  }
  getFilms(): Observable<any> {
    return this.http.get(this.apiUrls.films);
  }

  getSpecies(): Observable<any> {
    return this.http.get(this.apiUrls.species);
  }

  getVehicles(): Observable<any> {
    return this.http.get(this.apiUrls.vehicles);
  }

  getStarships(): Observable<any> {
    return this.http.get(this.apiUrls.starships);
  }
  getSpeciesData(url: string): Observable<any> {
    return this.http.get<any>(url);
}

getCharacterById(id: any): Observable<any> {
  return this.http.get<any>(`${this.apiUrls.people}${id}/`);
}

getSpecie(url: string): Observable<any> {
  return this.http.get<any>(url);
}

getFilm(url: string): Observable<any> {
  return this.http.get<any>(url);
}

getVehicle(url: string): Observable<any> {
  return this.http.get<any>(url);
}

getStarship(url: string): Observable<any> {
  return this.http.get<any>(url);
}
getPlanet(url: string): Observable<any> {
  return this.http.get<any>(url);
}
}