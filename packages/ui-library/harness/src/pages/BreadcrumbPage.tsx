import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage as BreadcrumbPageItem } from '@bytesyze-ui/core/breadcrumb'

export default function BreadcrumbPage() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Components</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPageItem>Breadcrumb</BreadcrumbPageItem>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
