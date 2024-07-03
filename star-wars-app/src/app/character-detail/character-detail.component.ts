import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../data.service'; // Update with your service path
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-character-detail',
  templateUrl: './character-detail.component.html',
  styleUrls: ['./character-detail.component.css']
})
export class CharacterDetailComponent implements OnInit, OnDestroy {
  character: any = {};
  species: any = [];
  films: any = [];
  vehicles: any = [];
  starships: any = [];
selectedUserId:string=this._activatedRoute.snapshot.params['id'];
  private routeSubscription: Subscription | null = null;

  constructor(
    private dataService: DataService,
    private _activatedRoute:ActivatedRoute
  ) {}

  ngOnInit(): void {
    console.log("inside character detail ",this.selectedUserId? this.selectedUserId:"nothing")
    this.loadCharacterDetails(this.selectedUserId);
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  loadCharacterDetails(characterId: string): void {
    this.dataService.getCharacterById(characterId).subscribe((data: any) => {
      this.character = data;
      this.fetchSpecies();
      this.fetchFilms();
      this.fetchVehicles();
      this.fetchStarships();
    });
  }

  // fetchSpecies(): void {
  //   if (this.character.species) {
  //     console.log("this.character.species",this.character.species.join())
  //     this.dataService.getSpecie(this.character.species.join()).subscribe((data: any) => {
  //       this.species = data;
  //     });
  //   }
  // }
  fetchSpecies(): void {
    const speciesUrls = this.character.species;
    speciesUrls.forEach((specieUrl: string) => {
      this.dataService.getSpecie(specieUrl).subscribe((data: any) => {
        this.species.push(data);
      });
    });
  }
  fetchFilms(): void {
    this.character.films.forEach((filmUrl: any) => {
      this.dataService.getFilm(filmUrl).subscribe((data: any) => {
        this.films.push(data);
      });
    });
  }

  fetchVehicles(): void {
    this.character.vehicles.forEach((vehicleUrl: any) => {
      this.dataService.getVehicle(vehicleUrl).subscribe((data: any) => {
        this.vehicles.push(data);
      });
    });
  }

  fetchStarships(): void {
    this.character.starships.forEach((starshipUrl: any) => {
      this.dataService.getStarship(starshipUrl).subscribe((data: any) => {
        this.starships.push(data);
      });
    });
  }
}
