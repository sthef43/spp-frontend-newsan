
-- DROP TABLE SGRHtest.db_owner.PostulacionesBlackList;

CREATE TABLE SGRHtest.db_owner.PostulacionesBlackList (
	Id int IDENTITY(1,1) NOT NULL,
	Dni int NOT NULL,
	CreatedDate datetime DEFAULT getdate() NULL,
	Deleted bit DEFAULT 0 NULL,
	NombreApellido varchar(128) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	CONSTRAINT PK_BlackList_Id PRIMARY KEY (Id),
	CONSTRAINT UQ__BlackLis__C0308575F1B8A877 UNIQUE (Dni)
);
CREATE UNIQUE NONCLUSTERED INDEX UQ__BlackLis__C0308575F1B8A877 ON SGRHtest.db_owner.PostulacionesBlackList (Dni);


-- SGRHtest.db_owner.PostulacionesDireccion definition

-- Drop table

-- DROP TABLE SGRHtest.db_owner.PostulacionesDireccion;

CREATE TABLE SGRHtest.db_owner.PostulacionesDireccion (
	Id int IDENTITY(1,1) NOT NULL,
	Domicilio varchar(128) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	Cuidad varchar(128) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	Provincia varchar(128) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	CodigoPostal int NOT NULL,
	CreatedDate datetime DEFAULT getdate() NULL,
	Deleted bit DEFAULT 0 NULL,
	CONSTRAINT PK_Direccion_Id PRIMARY KEY (Id)
);


-- SGRHtest.db_owner.PostulacionesEstadoCivil definition

-- Drop table

-- DROP TABLE SGRHtest.db_owner.PostulacionesEstadoCivil;

CREATE TABLE SGRHtest.db_owner.PostulacionesEstadoCivil (
	Id int IDENTITY(1,1) NOT NULL,
	Nombre varchar(128) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	CreatedDate datetime DEFAULT getdate() NULL,
	Deleted bit DEFAULT 0 NULL,
	CONSTRAINT PK_EstadoCivil_Id PRIMARY KEY (Id)
);


-- SGRHtest.db_owner.PostulacionesFormacionTipo definition

-- Drop table

-- DROP TABLE SGRHtest.db_owner.PostulacionesFormacionTipo;

CREATE TABLE SGRHtest.db_owner.PostulacionesFormacionTipo (
	Id int IDENTITY(1,1) NOT NULL,
	Nombre varchar(128) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	CreatedDate datetime DEFAULT getdate() NULL,
	Deleted bit DEFAULT 0 NULL,
	CONSTRAINT PK_FormacionTipo_Id PRIMARY KEY (Id)
);


-- SGRHtest.db_owner.PostulacionesNivelAlcanzado definition

-- Drop table

-- DROP TABLE SGRHtest.db_owner.PostulacionesNivelAlcanzado;

CREATE TABLE SGRHtest.db_owner.PostulacionesNivelAlcanzado (
	Id int IDENTITY(1,1) NOT NULL,
	Nombre varchar(128) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	CreatedDate datetime DEFAULT getdate() NULL,
	Deleted bit DEFAULT 0 NULL,
	CONSTRAINT PK_NivelAlcanzado_Id PRIMARY KEY (Id)
);


-- SGRHtest.db_owner.PostulacionesNivelIdioma definition

-- Drop table

-- DROP TABLE SGRHtest.db_owner.PostulacionesNivelIdioma;

CREATE TABLE SGRHtest.db_owner.PostulacionesNivelIdioma (
	Id int IDENTITY(1,1) NOT NULL,
	Nombre varchar(128) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	CreatedDate datetime DEFAULT getdate() NULL,
	Deleted bit DEFAULT 0 NULL,
	CONSTRAINT PK_NivelIdioma_Id PRIMARY KEY (Id)
);


-- SGRHtest.db_owner.PostulacionesPersona definition

-- Drop table

-- DROP TABLE SGRHtest.db_owner.PostulacionesPersona;

CREATE TABLE SGRHtest.db_owner.PostulacionesPersona (
	Id int IDENTITY(1,1) NOT NULL,
	DNI int NOT NULL,
	CreatedDate datetime DEFAULT getdate() NULL,
	Deleted bit DEFAULT 0 NULL,
	CONSTRAINT PK_Persona_Id PRIMARY KEY (Id),
	CONSTRAINT Persona_UN UNIQUE (DNI)
);
CREATE UNIQUE NONCLUSTERED INDEX Persona_UN ON SGRHtest.db_owner.PostulacionesPersona (DNI);


-- SGRHtest.db_owner.PostulacionesTipoGrupoFamiliar definition

-- Drop table

-- DROP TABLE SGRHtest.db_owner.PostulacionesTipoGrupoFamiliar;

CREATE TABLE SGRHtest.db_owner.PostulacionesTipoGrupoFamiliar (
	Id int IDENTITY(1,1) NOT NULL,
	Nombre varchar(128) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	CreatedDate datetime DEFAULT getdate() NULL,
	Deleted bit DEFAULT 0 NULL,
	CONSTRAINT PK_TipoGrupoFamiliar_Id PRIMARY KEY (Id)
);


-- SGRHtest.db_owner.PostulacionesAnteriorLugarTrabajo definition

-- Drop table

-- DROP TABLE SGRHtest.db_owner.PostulacionesAnteriorLugarTrabajo;

CREATE TABLE SGRHtest.db_owner.PostulacionesAnteriorLugarTrabajo (
	Id int IDENTITY(1,1) NOT NULL,
	PersonaId int NOT NULL,
	Empresa varchar(128) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	Calle varchar(128) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	Telefono bigint NULL,
	UltimaTarea varchar(128) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	OtrasTareas varchar(1024) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	NombreSupervisor varchar(128) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	RazonAlejamiento varchar(256) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	Desde datetime NULL,
	Hasta datetime NULL,
	CreatedDate datetime DEFAULT getdate() NULL,
	Deleted bit DEFAULT 0 NULL,
	CONSTRAINT PK_AnteriorLugarTrabajo_Id PRIMARY KEY (Id),
	CONSTRAINT FK_AnteriorLugarTrabajo_Personal FOREIGN KEY (PersonaId) REFERENCES SGRHtest.db_owner.PostulacionesPersona(Id) ON DELETE CASCADE
);


-- SGRHtest.db_owner.PostulacionesConocidos definition

-- Drop table

-- DROP TABLE SGRHtest.db_owner.PostulacionesConocidos;

CREATE TABLE SGRHtest.db_owner.PostulacionesConocidos (
	Id int IDENTITY(1,1) NOT NULL,
	PersonaId int NOT NULL,
	conocido bit NOT NULL,
	NombreApellido varchar(128) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	TareaConocido varchar(128) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	Vinculo varchar(128) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	Conocimiento bit NULL,
	CreatedDate datetime DEFAULT getdate() NULL,
	Deleted bit DEFAULT 0 NULL,
	CONSTRAINT PK_Conocidos_Id PRIMARY KEY (Id),
	CONSTRAINT FK_Conocidos_Personal FOREIGN KEY (PersonaId) REFERENCES SGRHtest.db_owner.PostulacionesPersona(Id) ON DELETE CASCADE
);


-- SGRHtest.db_owner.PostulacionesFormacionIdioma definition

-- Drop table

-- DROP TABLE SGRHtest.db_owner.PostulacionesFormacionIdioma;

CREATE TABLE SGRHtest.db_owner.PostulacionesFormacionIdioma (
	Id int IDENTITY(1,1) NOT NULL,
	Nombre varchar(256) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	Establecimiento varchar(256) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	PersonaId int NOT NULL,
	NivelIdiomaLecturaId int NULL,
	NivelIdiomaEscrituraId int NULL,
	NivelIdiomaHablaId int NULL,
	CreatedDate datetime DEFAULT getdate() NULL,
	Deleted bit DEFAULT 0 NULL,
	CONSTRAINT PK_FormacionIdioma_Id PRIMARY KEY (Id),
	CONSTRAINT FK_FormacionIdioma_NivelIdiomaEscritura FOREIGN KEY (NivelIdiomaEscrituraId) REFERENCES SGRHtest.db_owner.PostulacionesNivelIdioma(Id),
	CONSTRAINT FK_FormacionIdioma_NivelIdiomaHabla FOREIGN KEY (NivelIdiomaHablaId) REFERENCES SGRHtest.db_owner.PostulacionesNivelIdioma(Id),
	CONSTRAINT FK_FormacionIdioma_NivelIdiomaLectura FOREIGN KEY (NivelIdiomaLecturaId) REFERENCES SGRHtest.db_owner.PostulacionesNivelIdioma(Id),
	CONSTRAINT FK_FormacionIdioma_Persona FOREIGN KEY (PersonaId) REFERENCES SGRHtest.db_owner.PostulacionesPersona(Id) ON DELETE CASCADE
);


-- SGRHtest.db_owner.PostulacionesFormacionOtros definition

-- Drop table

-- DROP TABLE SGRHtest.db_owner.PostulacionesFormacionOtros;

CREATE TABLE SGRHtest.db_owner.PostulacionesFormacionOtros (
	Id int IDENTITY(1,1) NOT NULL,
	Texto varchar(1024) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	PersonaId int NOT NULL,
	CreatedDate datetime DEFAULT getdate() NULL,
	Deleted bit DEFAULT 0 NULL,
	CONSTRAINT PK_FormacionOtros_Id PRIMARY KEY (Id),
	CONSTRAINT FK_FormacionOtros_Persona FOREIGN KEY (PersonaId) REFERENCES SGRHtest.db_owner.PostulacionesPersona(Id) ON DELETE CASCADE
);


-- SGRHtest.db_owner.PostulacionesFormacionTitulo definition

-- Drop table

-- DROP TABLE SGRHtest.db_owner.PostulacionesFormacionTitulo;

CREATE TABLE SGRHtest.db_owner.PostulacionesFormacionTitulo (
	Id int IDENTITY(1,1) NOT NULL,
	FormacionTipoId int NOT NULL,
	PersonaId int NOT NULL,
	NombreInstitucion varchar(256) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	Actualmente bit NOT NULL,
	horario varchar(64) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	TituloObtenido varchar(256) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	Desde datetime NOT NULL,
	Hasta datetime DEFAULT getdate() NOT NULL,
	NivelAlcanzadoId int NOT NULL,
	CreatedDate datetime DEFAULT getdate() NULL,
	Deleted bit DEFAULT 0 NULL,
	CONSTRAINT PK_FormacionTitulo_Id PRIMARY KEY (Id),
	CONSTRAINT FK_FormacionTitulo_FormacionTipo FOREIGN KEY (FormacionTipoId) REFERENCES SGRHtest.db_owner.PostulacionesFormacionTipo(Id),
	CONSTRAINT FK_FormacionTitulo_NivelAlcanzado FOREIGN KEY (NivelAlcanzadoId) REFERENCES SGRHtest.db_owner.PostulacionesNivelAlcanzado(Id),
	CONSTRAINT FK_FormacionTitulo_Personal FOREIGN KEY (PersonaId) REFERENCES SGRHtest.db_owner.PostulacionesPersona(Id) ON DELETE CASCADE
);


-- SGRHtest.db_owner.PostulacionesGrupoFamiliar definition

-- Drop table

-- DROP TABLE SGRHtest.db_owner.PostulacionesGrupoFamiliar;

CREATE TABLE SGRHtest.db_owner.PostulacionesGrupoFamiliar (
	Id int IDENTITY(1,1) NOT NULL,
	PersonaId int NOT NULL,
	Nombre varchar(128) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	Apellido varchar(128) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	FechaNacimiento datetime NOT NULL,
	DireccionId int NOT NULL,
	TipoGrupoId int NOT NULL,
	vive bit NULL,
	Asucargo bit NULL,
	Ocupación varchar(128) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	OcupaciónDesde datetime DEFAULT NULL NULL,
	OcupacionHasta datetime DEFAULT getdate() NULL,
	CreatedDate datetime DEFAULT getdate() NULL,
	Deleted bit DEFAULT 0 NULL,
	Dni int NULL,
	CONSTRAINT PK_GrupoFamiliar_Id PRIMARY KEY (Id),
	CONSTRAINT FK_GrupoFamiliar_Persona FOREIGN KEY (PersonaId) REFERENCES SGRHtest.db_owner.PostulacionesPersona(Id) ON DELETE CASCADE,
	CONSTRAINT FK_GrupoFamiliar_TipoGrupo FOREIGN KEY (TipoGrupoId) REFERENCES SGRHtest.db_owner.PostulacionesTipoGrupoFamiliar(Id)
);


-- SGRHtest.db_owner.PostulacionesInformacionExtra definition

-- Drop table

-- DROP TABLE SGRHtest.db_owner.PostulacionesInformacionExtra;

CREATE TABLE SGRHtest.db_owner.PostulacionesInformacionExtra (
	Id int IDENTITY(1,1) NOT NULL,
	PersonaId int NOT NULL,
	NombreApellido varchar(128) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	Ocupacion varchar(128) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	Vinculo varchar(128) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	Domicilio varchar(128) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	Telefono bigint NULL,
	ImpedimentoTareas bit NOT NULL,
	RazonImpedimento varchar(128) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	UrlCV varchar(128) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	DeclacionDeDatos bit NOT NULL,
	CreatedDate datetime DEFAULT getdate() NULL,
	Deleted bit DEFAULT 0 NULL,
	CONSTRAINT PK_InformacionExtra_Id PRIMARY KEY (Id),
	CONSTRAINT FK_InformacionExtra_Personal FOREIGN KEY (PersonaId) REFERENCES SGRHtest.db_owner.PostulacionesPersona(Id) ON DELETE CASCADE
);


-- SGRHtest.db_owner.PostulacionesInformacionGeneral definition

-- Drop table

-- DROP TABLE SGRHtest.db_owner.PostulacionesInformacionGeneral;

CREATE TABLE SGRHtest.db_owner.PostulacionesInformacionGeneral (
	Id int IDENTITY(1,1) NOT NULL,
	PersonaId int NOT NULL,
	ViviendaPropia bit NOT NULL,
	TipoViviendaCasa bit NOT NULL,
	ViviendaCompartida varchar(128) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	RegistroConductor int NULL,
	categoria varchar(128) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	FechaIngresoProvincia datetime NULL,
	MotivoIngresoProvicia varchar(128) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	ProviciaProveniente varchar(64) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	Fuma bit NOT NULL,
	Cuanto varchar(64) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	Peso int NOT NULL,
	Estatura int NOT NULL,
	Diestro bit NOT NULL,
	Lentes bit NOT NULL,
	HabilidadManual varchar(128) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	HabilidadLecturas varchar(128) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	Deportes varchar(128) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	TareaComunitaria varchar(128) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	CreatedDate datetime DEFAULT getdate() NULL,
	Deleted bit DEFAULT 0 NULL,
	CONSTRAINT PK_InformacionGeneral_Id PRIMARY KEY (Id),
	CONSTRAINT FK_InformacionGeneral_Personal FOREIGN KEY (PersonaId) REFERENCES SGRHtest.db_owner.PostulacionesPersona(Id) ON DELETE CASCADE
);


-- SGRHtest.db_owner.PostulacionesInformacionPersonal definition

-- Drop table

-- DROP TABLE SGRHtest.db_owner.PostulacionesInformacionPersonal;

CREATE TABLE SGRHtest.db_owner.PostulacionesInformacionPersonal (
	Id int IDENTITY(1,1) NOT NULL,
	Nombre varchar(128) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	Apellido varchar(128) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	DireccionId int NOT NULL,
	Telefono bigint NOT NULL,
	DireccionDNIId int NOT NULL,
	FechaNacimiento datetime NOT NULL,
	Nacionalidad varchar(128) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	Cuil bigint NOT NULL,
	PersonaId int NOT NULL,
	EstadoCivilId int NOT NULL,
	CreatedDate datetime DEFAULT getdate() NULL,
	Deleted bit DEFAULT 0 NULL,
	SexoHombre bit DEFAULT 0 NOT NULL,
	CONSTRAINT PK_InformacionPersonal_Id PRIMARY KEY (Id),
	CONSTRAINT FK_InformacionPersonal_Direccion FOREIGN KEY (DireccionId) REFERENCES SGRHtest.db_owner.PostulacionesDireccion(Id),
	CONSTRAINT FK_InformacionPersonal_EstadoCivil FOREIGN KEY (EstadoCivilId) REFERENCES SGRHtest.db_owner.PostulacionesEstadoCivil(Id),
	CONSTRAINT FK_InformacionPersonal_Persona FOREIGN KEY (PersonaId) REFERENCES SGRHtest.db_owner.PostulacionesPersona(Id) ON DELETE CASCADE
);


-- SGRHtest.db_owner.PostulacionesReferencia definition

-- Drop table

-- DROP TABLE SGRHtest.db_owner.PostulacionesReferencia;

CREATE TABLE SGRHtest.db_owner.PostulacionesReferencia (
	Id int IDENTITY(1,1) NOT NULL,
	PersonaId int NOT NULL,
	NombreApellido varchar(128) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	Telefono bigint NULL,
	CreatedDate datetime DEFAULT getdate() NULL,
	Deleted bit DEFAULT 0 NULL,
	CONSTRAINT PK_Referencia_Id PRIMARY KEY (Id),
	CONSTRAINT FK_Referencia_Personal FOREIGN KEY (PersonaId) REFERENCES SGRHtest.db_owner.PostulacionesPersona(Id) ON DELETE CASCADE
);