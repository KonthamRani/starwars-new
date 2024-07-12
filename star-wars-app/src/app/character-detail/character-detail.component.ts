import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../data.service'; 

@Component({
  selector: 'app-character-detail',
  templateUrl: './character-detail.component.html',
  styleUrls: ['./character-detail.component.css']
})
export class CharacterDetailComponent implements OnInit, OnDestroy {
  character: any = {};
  species: any = [];
  planets:any=[];
  films: any = [];
  vehicles: any = [];
  starships: any = [];
selectedUserId:string=this._activatedRoute.snapshot.params['id'];
  isLoading: boolean=true;

  constructor(
    private dataService: DataService,
    private _activatedRoute:ActivatedRoute
  ) {}

  ngOnInit(): void {
    console.log(this._activatedRoute);
    console.log("inside character detail ",this.selectedUserId? this.selectedUserId:"---")
    this.loadCharacterDetails(this.selectedUserId);
  }

  ngOnDestroy(): void {
  }

  loadCharacterDetails(characterId: string): void {
    this.isLoading=true;
    this.dataService.getCharacterById(characterId).subscribe((data: any) => {
      this.character = data;
      this.fetchSpecies();
      this.fetchFilms();
      this.fetchVehicles();
      this.fetchStarships();
      this.fetchPlanet();
      this.isLoading=false;
    },
    error=>{
      this.isLoading=false;
      console.log("getCharacterById",error)
    }
    );
  }


  fetchSpecies(): void {
    const speciesUrls = this.character.species;
    this.isLoading=true;
    speciesUrls.forEach((specieUrl: string) => {
      this.dataService.getSpecie(specieUrl).subscribe((data: any) => {
        this.species.push(data);
        this.isLoading=false;
      });
    },
      (error: any)=>{
      this.isLoading=false;
      console.log("getSpecie",error)
    });
  }
  fetchPlanet(): void {
    this.isLoading=true;
    const planetUrls = this.character.homeworld;
    this.dataService.getPlanet(planetUrls).subscribe((data: any) => {
      this.planets.push(data);
      this.isLoading=false
    },
    (error: any)=>{
    this.isLoading=false;
    console.log("getSpecie",error)
  });
  }
  fetchFilms(): void {
    this.isLoading=true;
    this.character.films.forEach((filmUrl: any) => {
      this.dataService.getFilm(filmUrl).subscribe((data: any) => {
        this.films.push(data);
        this.isLoading=false;
      },
      (error: any)=>{
      this.isLoading=false;
      console.log("getFilm",error)
    });
    });
  }

  fetchVehicles(): void {
    this.isLoading=true;
    this.character.vehicles.forEach((vehicleUrl: any) => {
      this.dataService.getVehicle(vehicleUrl).subscribe((data: any) => {
        this.vehicles.push(data);
        this.isLoading=false;
      },
      (error: any)=>{
      this.isLoading=false;
      console.log("getVehicle",error)
    });
    });
  }

  fetchStarships(): void {
    this.isLoading=true;
    this.character.starships.forEach((starshipUrl: any) => {
      this.dataService.getStarship(starshipUrl).subscribe((data: any) => {
        this.starships.push(data);
        this.isLoading=false;
      },
      (error: any)=>{
      this.isLoading=false;
      console.log("getStarship",error)
    });
    });
  }
}
