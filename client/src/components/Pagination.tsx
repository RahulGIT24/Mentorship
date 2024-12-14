import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext, PaginationEllipsis } from "../components/ui/pagination"; // Assuming you have imported necessary components

function PaginatedPagination({ currentPage, totalPages, onPageChange }: { currentPage: number, totalPages: number, onPageChange: any }) {
    // Create page number buttons
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <Pagination>
            <PaginationContent className="flex space-x-2">
                {/* Previous Button */}
                <PaginationItem>
                    <PaginationPrevious
                        size="lg"
                        className={"p-3 text-xl"}
                        href="#"
                        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
                    />
                </PaginationItem>

                {/* Dynamic Page Numbers */}
                {pageNumbers.map((page) => (
                    <PaginationItem key={page}>
                        <PaginationLink
                            size="lg"
                            href="#"
                            onClick={() => onPageChange(page)}
                            isActive={currentPage === page}
                            className={"p-3 text-xl w-11 h-11"}
                        >
                            {page}
                        </PaginationLink>
                    </PaginationItem>
                ))}

                {/* Ellipsis for large number of pages */}
                {totalPages > 5 && (
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                )}

                {/* Next Button */}
                <PaginationItem>
                    <PaginationNext
                        size="lg"
                        className={"p-3 text-xl"}
                        href="#"
                        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
                    // disabled={currentPage === totalPages}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}

export default PaginatedPagination;
