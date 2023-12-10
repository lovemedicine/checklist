import { useState } from 'react'
import List from './List'
import { List as ListType } from '../types/models'

type ListListProps = {
  lists: ListType[]
  isLoading: boolean
  refreshLists: () => any
}

export default function SkillList({ lists, isLoading, refreshLists }: ListListProps) {
  return (
    <>
      { isLoading && <div>Loading...</div> }
      { !isLoading &&
        <>
          { lists.map(list => (
            <List list={list} refreshLists={refreshLists} />
          )) }
        </>
      }
    </>
  )
}

