'use client'

import { useState, useEffect } from 'react'
import { Box, Typography } from '@mui/material'
import SkillList from '../../components/SkillList'
import { User } from '../../types/models'
import { fetchUser, fetchSkills } from '../../util/api'

type UserPageProps = {
  params: {
    username: string
  }
}

export default function UserPage({ params: { username } }: UserPageProps) {
  let [user, setUser] = useState<User | null>(null)
  let [userSkills, setUserSkills] = useState<UserSkill[]>([])
  let [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchUser(username).then(user => {
      setUser(user)
      fetchSkills(user.id).then(skills => {
        setUserSkills(skills)
        setIsLoading(false)
      })
    })
  }, [])

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h5">User: {username}</Typography>
        { user &&
          <Typography variant="body1">
            <div>email: {user.email}</div>
            { (user.firstName || user.lastName) && <div>name: {user.firstName} {user.lastName}</div> }
          </Typography>
        }
      </Box>

      { user &&
        <>
          <Typography variant="h6">All skills</Typography>
          <SkillList userSkills={userSkills} isLoading={isLoading} />
        </>
      }
    </>
  )
}
