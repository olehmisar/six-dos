contract ModuleInterface {
    use dep::aztec::prelude::AztecAddress;

    #[aztec(private)]
    fn links_callback(from: AztecAddress, to: AztecAddress) -> pub Field {
        0
    }
}
