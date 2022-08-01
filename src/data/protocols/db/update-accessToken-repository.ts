
export interface UpadateAccesTokenRepository {
  update: (id: string, token: string) => Promise<void>
}
