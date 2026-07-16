export class CreateEventDto {
  title!: string;
  date!: string; // Will be parsed into a Date object
  location!: string;
  description?: string;
}
