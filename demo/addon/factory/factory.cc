#include <node.h>

using namespace v8;

Handle<Value> myFunc(const Arguments& args) {
	HandleScope scope;
	return scope.Close(String::New("It is printed by my func"));
}

Handle<Value> createFunc(const Arguments& args) {
	HandleScope scope;

	Local<FunctionTemplate> tpl = FunctionTemplate::New(myFunc);
	Local<Function> fn = tpl->GetFunction();

	return scope.Close(fn);
}

//e.g.: create('name', 'angl');
Handle<Value> createObject(const Arguments& args) {
	HandleScope scope;

	Local<Object> obj = Object::New();
	String::Utf8Value param(args[0]->ToString());
	obj->Set(String::NewSymbol(*param), args[1]->ToString());

	return scope.Close(obj);
}

void init(Handle<Object> exports) {
	exports->Set(String::NewSymbol("createFunc"), FunctionTemplate::New(createFunc)->GetFunction());
	exports->Set(String::NewSymbol("createObject"), FunctionTemplate::New(createObject)->GetFunction());
}


NODE_MODULE(factory, init)
