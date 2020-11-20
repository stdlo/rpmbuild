docker run --workdir "//github/workspace" --rm \
    -e INPUT_SPEC_FILE=example/hello-typescript.spec \
    -e INPUT_SRC_ARCHIVE=example/artifacts/hello-typescript.tar.gz \
    -v "/$(pwd)://github/workspace" rpmbuild