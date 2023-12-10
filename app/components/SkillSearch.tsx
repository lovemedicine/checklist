import { TextField, InputAdornment } from '@mui/material'
import Search from '@mui/icons-material/Search'

type SkillSearchProps = {
  query: string,
  onChange: (event: any) => any
}

export default function SkillSearch({ query, onChange }: SkillSearchProps) {
  return (
    <div className="mb-3">
    <TextField
      variant="outlined"
      size="small"
      value={query}
      onChange={onChange}
      placeholder="Enter search text here..."
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <Search />
          </InputAdornment>
        ),
      }}
      />
    </div>
  )
}