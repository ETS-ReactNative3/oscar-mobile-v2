import Realm from "realm"

class Task extends Realm.Object {}
Task.schema = {
  name: "Task",
  properties: {
    id: "int",
    client_id: "int",
    name: "string",
    completion_date: "string",
    domain_id: "int",
    domain: "string",
    status: { type: "string", default: "update" }
  }
}

class ClientProfile extends Realm.Object {}
ClientProfile.schema = {
  name: "ClientProfile",
  properties: {
    id: { type: "int", optional: true },
    client_id: "int",
    client_params: "string",
    type: "string",
    status: { type: "string", optional: true },
  }
}

class FamilyProfile extends Realm.Object {}
FamilyProfile.schema = {
  name: 'FamilyProfile',
  properties: {
    id: 'int',
    family: 'string',
    type: "string",
    family_params: { type: 'string', optional: true },
    status: { type: 'string', optional: true },
  }
}

class Setting extends Realm.Object {}
Setting.schema = {
  name: 'Setting',
  properties: {
    key: 'string',
    value: 'string'
  }
}

class CustomFieldProperties extends Realm.Object {}
CustomFieldProperties.schema = {
  name: 'CustomFieldProperties',
  properties: {
    id: 'int',
    custom_field_id: 'int',
    custom_formable_id: 'int',
    custom_formable_type: 'string',
    properties: 'string',
    created_at: 'date',
    type: 'string',
    custom_field_property_path: 'string'
  }
}

export default new Realm({ schema: [Task, ClientProfile, FamilyProfile, Setting, CustomFieldProperties], schemaVersion: 1.1 })
