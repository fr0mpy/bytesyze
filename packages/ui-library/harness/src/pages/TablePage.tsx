import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption } from '@bytesyze-ui/core/table'

export default function TablePage() {
  return (
    <Table>
      <TableCaption>A list of recent transactions</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>001</TableCell>
          <TableCell>Completed</TableCell>
          <TableCell>$250.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>002</TableCell>
          <TableCell>Pending</TableCell>
          <TableCell>$150.00</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}
