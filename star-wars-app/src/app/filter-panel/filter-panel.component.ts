import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DataService } from '../data.service';

export interface Species {
  name: string;
  classification: string;
  designation: string;
  average_height: string;
  skin_colors: string;
  hair_colors: string;
  eye_colors: string;
  average_lifespan: string;
  homeworld: string | null;
  language: string;
  people: string[];
  films: string[];
  created: string;
  edited: string;
  url: string;
}
export interface Film {
  title: string;
  episode_id: number;
  opening_crawl: string;
  director: string;
  producer: string;
  release_date: string;
  characters: string[];
  planets: string[];
  starships: string[];
  vehicles: string[];
  species: string[];
  created: string;
  edited: string;
  url: string;
}
export interface Vehicle {
  name: string;
  model: string;
  manufacturer: string;
  cost_in_credits: string;
  length: string;
  max_atmosphering_speed: string;
  crew: string;
  passengers: string;
  cargo_capacity: string;
  consumables: string;
  vehicle_class: string;
  pilots: string[];
  films: string[];
  created: string;
  edited: string;
  url: string;
}
export interface Starship {
  name: string;
  model: string;
  manufacturer: string;
  cost_in_credits: string;
  length: string;
  max_atmosphering_speed: string;
  crew: string;
  passengers: string;
  cargo_capacity: string;
  consumables: string;
  hyperdrive_rating: string;
  MGLT: string;
  starship_class: string;
  pilots: string[];
  films: string[];
  created: string;
  edited: string;
  url: string;
}
@Component({
  selector: 'app-filter-panel',
  templateUrl: './filter-panel.component.html',
  styleUrls: ['./filter-panel.component.css'],
})
export class FilterPanelComponent implements OnInit {
  films:Film[] = [];
  species :Species[] = [];
  starships:Starship[]=[];
  vehicles:Vehicle[]=[];
  filters: {
    movieName: { [key: string]: boolean };
    species: { [key: string]: boolean };
    vehicles: { [key: string]: boolean };
    starships: { [key: string]: boolean };
    birthYear: string;
  } = {
    movieName: { all: true },
    species: { all: false },
    vehicles: { all: true },
    starships: { all: true },
    birthYear: 'ALL',
  };

  @Output() filterChange = new EventEmitter<any>();

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getFilms().subscribe((data) => (this.films = data.results));
    this.dataService.getSpecies().subscribe((data) => (this.species = data.results));
    this.dataService.getVehicles().subscribe((data) => (this.vehicles = data.results));
    this.dataService.getStarships().subscribe((data) => (this.starships = data.results));
    // Similarly fetch vehicles and starships
  }

  search() {
    this.filterChange.emit(this.filters);
  }
}
