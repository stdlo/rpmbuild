docker run --workdir "//github/workspace" --rm \
    -e INPUT_SPEC_FILE=example/.rpm/hello-typescript.spec \
    -e INPUT__TOPDIR=example/.rpm/build \
    -e GITHUB_REPOSITORY=rpmbuild \
    -e GITHUB_REPOSITORY_OWNER=loganbickmore \
    -e GITHUB_REF=refs/heads/main \
    -v "/$(pwd)://github/workspace" rpmbuild