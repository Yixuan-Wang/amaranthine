module "pangu" {
  declare const pangu: Pangu;
  export default pangu;

  interface Pangu {
    spacing: (string) => string
  }
}
