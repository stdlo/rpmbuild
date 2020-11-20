<p align="center">
  <a href="https://github.com/loganbickmore/rpmbuild/actions"><img alt="typescript-action status" src="https://github.com/loganbickmore/rpmbuild/workflows/build-test/badge.svg"></a>
  <a href="https://github.com/loganbickmore/rpmbuild/actions"><img alt="typescript-action status" src="https://github.com/loganbickmore/rpmbuild/workflows/build-release/badge.svg"></a>
</p>

# GitHub Action - Build RPM Package

This GitHub Action builds RPM files by using a specfile and an archive artifact, usually created during a preceeding build step. Outputs allow RPM files to be uploaded as an Artifact (`actions/upload-artifact`) or as a Release Asset (`actions/upload-release-asset`).


## Usage
### Pre-requisites
Create a workflow `.yml` file in your repositories `.github/workflows` directory. An [example workflow](#example-workflow---build-rpm) is available below. For more information, reference the GitHub Help Documentation for [Creating a workflow file](https://help.github.com/en/articles/configuring-a-workflow#creating-a-workflow-file). 

### Inputs

- `spec_file`: Path to the spec file. [**required**]
- `src_archive`: Path to the source archive file (`.tar.gz`, `.tgz`). [**required**]

### Outputs

- `rpm_path`: Path to RPM file found in the `rpmbuild/RPMS` folder
- `rpm_name`: Name of RPM file taken from the path
- `rpm_content_type`: Content type for usage with `actions/upload-release-asset`

### Example workflow - build RPM

based on ./example

```yaml
name: RPM Build
on: push

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2

    - run: npm install

    - run: make build bundle zip

    - name: Build RPM
      id: rpm_build
      uses: loganbickmore/rpmbuild@v1.0.0
      with:
        spec_file: 'hello-typescript.spec'
        src_archive: 'artifacts/hello-typescript.tar.gz'

    - name: Upload artifact
      uses: actions/upload-artifact@v1.0.0
      with:
        name: Binary RPM Artifact
        path: ${{ steps.rpm_build.outputs.rpm_path }}
```
