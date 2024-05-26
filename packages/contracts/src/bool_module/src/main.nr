contract BoolModule {
    use dep::aztec::prelude::AztecAddress;

    #[aztec(private)]
    fn links_callback(from: AztecAddress, to: AztecAddress) -> Field {
        1 // this callback is called only if the link exists
    }
}
