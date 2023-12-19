import TimeAgo from 'react-timeago'
import Link from 'next/link'
import { Card, CardContent, Typography } from '@mui/material'
import { DeleteForever } from '@mui/icons-material'
import { deleteList } from '../util/api'
import { List } from '../types/models'

type ListProps = {
  list: List
  refreshLists: () => any
}

export default function List({ list, refreshLists }: ListProps) {
  const timeFormatter = (value: number, unit: TimeAgo.Unit, suffix: TimeAgo.Suffix) => {
    if (unit === 'second') return 'just now';
    const plural: string = value !== 1 ? 's' : '';
    return `${value} ${unit}${plural} ${suffix}`;
  }

  async function handleDelete(id: number) {
    await deleteList(id)
    refreshLists()
  }

  return (
    <Card key={list.id} variant="outlined" sx={{ mt: 1 }}>
      <CardContent sx={{ p: 1, "&:last-child": { pb: 1 } }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h5">
            <Link href={`/list/${list.id}`}>
              {list.name} {list.date ? `(${list.date})` : ''}
            </Link>
          </Typography>
          <DeleteForever sx={{ color: 'grey' }} onClick={() => handleDelete(list.id)} />
        </div>
        <Typography variant="body2">
          created <TimeAgo date={list.createdAt} live={false} formatter={timeFormatter} />
        </Typography>
      </CardContent>
    </Card>
  )
}
