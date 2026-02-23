'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export interface TeamPokemon {
  id: string
  name: string
  types: string[]
  moves: string[]
  ability: string
  item: string
}

export interface Team {
  id: string
  name: string
  pokemon: TeamPokemon[]
  createdAt: Date
  updatedAt: Date
}

// In a real app, this would be stored in a database
const teams = new Map<string, Team>()

export async function createTeam(formData: FormData) {
  const name = formData.get('name') as string
  const pokemonJson = formData.get('pokemon') as string
  
  if (!name || !pokemonJson) {
    throw new Error('Missing required fields')
  }

  try {
    const pokemon: TeamPokemon[] = JSON.parse(pokemonJson)
    const team: Team = {
      id: crypto.randomUUID(),
      name,
      pokemon,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    teams.set(team.id, team)
    revalidatePath('/team')
    redirect(`/team/${team.id}`)
  } catch (error) {
    throw new Error('Failed to create team')
  }
}

export async function updateTeam(teamId: string, formData: FormData) {
  const name = formData.get('name') as string
  const pokemonJson = formData.get('pokemon') as string
  
  if (!name || !pokemonJson) {
    throw new Error('Missing required fields')
  }

  const existingTeam = teams.get(teamId)
  if (!existingTeam) {
    throw new Error('Team not found')
  }

  try {
    const pokemon: TeamPokemon[] = JSON.parse(pokemonJson)
    const updatedTeam: Team = {
      ...existingTeam,
      name,
      pokemon,
      updatedAt: new Date(),
    }

    teams.set(teamId, updatedTeam)
    revalidatePath(`/team/${teamId}`)
    revalidatePath('/team')
  } catch (error) {
    throw new Error('Failed to update team')
  }
}

export async function deleteTeam(teamId: string) {
  const team = teams.get(teamId)
  if (!team) {
    throw new Error('Team not found')
  }

  teams.delete(teamId)
  revalidatePath('/team')
  redirect('/team')
}

export async function getTeam(teamId: string): Promise<Team | null> {
  return teams.get(teamId) || null
}

export async function getAllTeams(): Promise<Team[]> {
  return Array.from(teams.values()).sort((a, b) => 
    b.updatedAt.getTime() - a.updatedAt.getTime()
  )
}
