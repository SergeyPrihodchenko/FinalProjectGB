<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use App\Http\Requests\Company\StoreCompanyRequest;
use App\Models\City;
use App\Models\CompanyUser;
use App\Models\Company;
use App\Models\ReviewsOfCompanies;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\Model;
use Inertia\Inertia;
use function PHPUnit\Framework\isEmpty;
use function Termwind\render;

class CompanyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $companies = Company::all();
        //dd($companies);
        //dd($request->all());
        //$date = $request->all();
        return Inertia::render('CompanyListPage/ui/CompanyListPage/CompanyListPage', [
            'companies' => $companies
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $cities = City::all();
        return Inertia::render('CompanyPageCreate/ui/CompanyPageCreate/CompanyPageCreate', ['cities' => $cities]);
        //return view('company.create');

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCompanyRequest $request)
    {
        $data = $request->validated();
        $creatorId = Auth::user()->id;
        $data['creator_id'] = $creatorId;
        //Company::create($data);

        $path = $request->file('logo')->storeAs('images',$data['logo']->hashName(), 'public');
        $data['logo'] = $path;
        //dd($data['logo']);
        //dd($path);
        $company = Company::create($data);

        return Redirect::route('myCompanies');
    }

    /**
     * Display the specified resource.
     */
    public function show(Company $company)
    {
        $grade=4;
        $subscribes = CompanyUser::where('company_id', $company->id)->where('user_id', Auth::user()->id)->first();
        //dd($subscribes);
        $isSubscribed = $subscribes ? true : false;

        $companyImageURL = $company->getLogoUrl();

        $reviews = $company->reviews;
        $reviews = ReviewsOfCompanies::where('company_id', $company->id)->get();
//dd($reviews);

        //dd($companyImageURL);

        return Inertia::render('CompanyPage/CompanyPage', [
            'company' => $company,
            'isSubscribed' => $isSubscribed,
            'companyImageURL' => $companyImageURL,
            'reviews' => $reviews,
            'grade' => $grade
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Company $company)
    {

        return Inertia::render('CompanyPageUpdate/ui/CompanyPageUpdate/CompanyPageUpdate', [
            'company' => $company,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StoreCompanyRequest $request, $id)
    {
        $data = $request->validated();
        $company = Company::find($id);
        $company->update($data);
        //        return Inertia::render('CompanyPage/CompanyPage', [
        //            'company' => $company,
        //        ]);
        return Redirect::route('myCompanies');
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Company $company)
    {
        $company->delete();
        return Redirect::route('myCompanies');
    }




}
