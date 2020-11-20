%define NAME hello-typescript
%define APPDATADIR %{_datadir}/%{NAME}
%define NGINXCONFDIR /etc/nginx/conf.d

Name:           %{NAME}
Version:        %(echo ${TAG:-latest})
Release:        1%{?dist}
Summary:        Hello World
License:        UNLICENSED
Source0:        %{NAME}.tar.gz
Requires:       bash
Requires(pre):  shadow-utils
BuildArch:      noarch


%description
foo

%setup -q -n %{NAME}

%install
# make necessary directories
mkdir -p \
    %{buildroot}%{APPDATADIR} \
    %{buildroot}%{_bindir} 

install -m 644 package.json package-lock.json %{buildroot}%{APPDATADIR}
cp -a dist/ %{buildroot}%{APPDATADIR}/dist/
cp -a node_modules/ %{buildroot}%{APPDATADIR}/node_modules/

install -m 744 %{NAME} %{buildroot}%{_bindir}


%files
%{_datadir}/%{NAME}/*
%{_bindir}/%{NAME}

%postun
rm -rf %{_bindir}/%{NAME}
rm -rf %{_datadir}/%{NAME}