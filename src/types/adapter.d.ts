export interface AdapterInterface {
  read(language: string): Record<string, string>
  write(language: string, translations: Record<string, string>, override?: boolean): void
}
