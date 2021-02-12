from enum import Enum
from typing import List

from pydantic import (
    BaseModel,
    Extra,
    Field,
)


class RemoteFilesTarget(str, Enum):
    ftpdir = "ftpdir"
    userdir = "userdir"
    importdir = "importdir"


class RemoteFilesFormat(str, Enum):
    flat = "flat"
    jstree = "jstree"
    uri = "uri"


class RemoteFilesDisableMode(str, Enum):
    folders = "folders"
    files = "files"


class FilesSourcePlugin(BaseModel):
    id: str = Field(
        ...,  # This field is required
        title="ID",
        description="The `FilesSource` plugin identifier",
        example="_import",
    )
    type: str = Field(
        ...,  # This field is required
        title="Type",
        description="The type of the plugin.",
        example="gximport",
    )
    uri_root: str = Field(
        ...,  # This field is required
        title="URI root",
        description="The URI root used by this type of plugin.",
        example="gximport://",
    )
    label: str = Field(
        ...,  # This field is required
        title="Label",
        description="The display label for this plugin.",
        example="Library Import Directory",
    )
    doc: str = Field(
        ...,  # This field is required
        title="Documentation",
        description="Documentation or extended description for this plugin.",
        example="Galaxy's library import directory",
    )
    writable: bool = Field(
        ...,  # This field is required
        title="Writeable",
        description="Whether this files source plugin allows write access.",
        example=False,
    )

    class Config:
        # This allows additional fields (that are not validated)
        # to be serialized/deserealized. This allows to have
        # different fields depending on the plugin type
        extra = Extra.allow


class FilesSourcePluginList(BaseModel):
    __root__: List[FilesSourcePlugin] = Field(
        default=[],
        title='List of files source plugins',
        example=[{
            "id": "_import",
            "type": "gximport",
            "uri_root": "gximport://",
            "label": "Library Import Directory",
            "doc": "Galaxy's library import directory",
            "writable": False
        }]
    )