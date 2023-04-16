import Image from "next/image";
import { UploadIcon } from "@heroicons/react/outline";

const GameDetails = ({ title, date, creator, rating, difficulty }) => {
    return (
        <nav className="text-[#232123] bg-[#F9F9F9]">
            <div className="relative flex-col mx-40 my-10">
                <h2 className="absolute top-0 left-0 text-header font-medium mb-4">{title}</h2>
                <div className="absolute top-3 right-0 flex-row space-x-5 text-xl">
                    <a>{date}</a>
                    <a>By: <a className="text-[#D63636]">{creator}</a></a>
                </div>
                <hr className="relative top-10" />
                <div className="mt-20 grid grid-cols-2">
                    <Image className="mx-auto rounded-lg drop-shadow-[0_10px_8px_rgba(0,0,0,0.50)]" src="/images/ShowcasedImage-Test.png" width={650} height={494} />
                    <div className="border w-[86%] h-[139%] rounded-lg bg-[#F9F9F9] drop-shadow-[0_10px_8px_rgba(0,0,0,0.50)] flex flex-col">
                        <h2 className="mt-5 mx-5 text-2xl font-medium">Rating:</h2>
                        <hr className="mt-2 mx-5" />
                        <div className="mt-5 mx-5 flex flex-row">
                            <div className="flex justify-start space-x-2">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2.51487C18.6572 -4.48017 35.3016 7.76039 12 23.5C-11.3016 7.76192 5.34282 -4.48017 12 2.51487Z" fill="#D63636" />
                                </svg>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2.51487C18.6572 -4.48017 35.3016 7.76039 12 23.5C-11.3016 7.76192 5.34282 -4.48017 12 2.51487Z" fill="#D63636" />
                                </svg>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2.51487C18.6572 -4.48017 35.3016 7.76039 12 23.5C-11.3016 7.76192 5.34282 -4.48017 12 2.51487Z" fill="#D63636" />
                                </svg>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2.51487C18.6572 -4.48017 35.3016 7.76039 12 23.5C-11.3016 7.76192 5.34282 -4.48017 12 2.51487Z" fill="#D63636" />
                                </svg>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2.51487C18.6572 -4.48017 35.3016 7.76039 12 23.5C-11.3016 7.76192 5.34282 -4.48017 12 2.51487Z" fill="#D63636" />
                                </svg>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2.51487C18.6572 -4.48017 35.3016 7.76039 12 23.5C-11.3016 7.76192 5.34282 -4.48017 12 2.51487Z" fill="#D63636" />
                                </svg>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2.51487C18.6572 -4.48017 35.3016 7.76039 12 23.5C-11.3016 7.76192 5.34282 -4.48017 12 2.51487Z" fill="#D63636" />
                                </svg>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2.51487C18.6572 -4.48017 35.3016 7.76039 12 23.5C-11.3016 7.76192 5.34282 -4.48017 12 2.51487Z" fill="#E4E4E4" />
                                </svg>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2.51487C18.6572 -4.48017 35.3016 7.76039 12 23.5C-11.3016 7.76192 5.34282 -4.48017 12 2.51487Z" fill="#E4E4E4" />
                                </svg>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2.51487C18.6572 -4.48017 35.3016 7.76039 12 23.5C-11.3016 7.76192 5.34282 -4.48017 12 2.51487Z" fill="#E4E4E4" />
                                </svg>
                            </div>
                            <div className="absolute right-0 mx-10">
                                <a className="text-xl">{rating}%</a>
                            </div>
                        </div>
                        <h2 className="mt-10 mx-5 text-2xl font-medium">Difficulty:</h2>
                        <hr className="mt-2 mx-5" />
                        <div className="mt-5 mx-5 flex flex-row">
                            <div className="flex justify-start space-x-2">
                                <svg width="22" height="24" viewBox="0 0 22 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0.595152 20.149L11 0.899994L21.4048 20.149C22.1251 21.4815 21.1602 23.1 19.6454 23.1H2.35457C0.839797 23.1 -0.125147 21.4815 0.595152 20.149Z" fill="#1EB475" />
                                </svg>
                                <svg width="22" height="24" viewBox="0 0 22 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0.595152 20.149L11 0.899994L21.4048 20.149C22.1251 21.4815 21.1602 23.1 19.6454 23.1H2.35457C0.839797 23.1 -0.125147 21.4815 0.595152 20.149Z" fill="#1EB475" />
                                </svg>
                                <svg width="22" height="24" viewBox="0 0 22 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0.595152 20.149L11 0.899994L21.4048 20.149C22.1251 21.4815 21.1602 23.1 19.6454 23.1H2.35457C0.839797 23.1 -0.125147 21.4815 0.595152 20.149Z" fill="#1EB475" />
                                </svg>
                                <svg width="22" height="24" viewBox="0 0 22 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0.595152 20.149L11 0.899994L21.4048 20.149C22.1251 21.4815 21.1602 23.1 19.6454 23.1H2.35457C0.839797 23.1 -0.125147 21.4815 0.595152 20.149Z" fill="#1EB475" />
                                </svg>
                                <svg width="22" height="24" viewBox="0 0 22 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0.595152 20.149L11 0.899994L21.4048 20.149C22.1251 21.4815 21.1602 23.1 19.6454 23.1H2.35457C0.839797 23.1 -0.125147 21.4815 0.595152 20.149Z" fill="#1EB475" />
                                </svg>
                                <svg width="22" height="24" viewBox="0 0 22 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0.595152 20.149L11 0.899994L21.4048 20.149C22.1251 21.4815 21.1602 23.1 19.6454 23.1H2.35457C0.839797 23.1 -0.125147 21.4815 0.595152 20.149Z" fill="#E4E4E4" />
                                </svg>
                                <svg width="22" height="24" viewBox="0 0 22 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0.595152 20.149L11 0.899994L21.4048 20.149C22.1251 21.4815 21.1602 23.1 19.6454 23.1H2.35457C0.839797 23.1 -0.125147 21.4815 0.595152 20.149Z" fill="#E4E4E4" />
                                </svg>
                                <svg width="22" height="24" viewBox="0 0 22 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0.595152 20.149L11 0.899994L21.4048 20.149C22.1251 21.4815 21.1602 23.1 19.6454 23.1H2.35457C0.839797 23.1 -0.125147 21.4815 0.595152 20.149Z" fill="#E4E4E4" />
                                </svg>
                                <svg width="22" height="24" viewBox="0 0 22 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0.595152 20.149L11 0.899994L21.4048 20.149C22.1251 21.4815 21.1602 23.1 19.6454 23.1H2.35457C0.839797 23.1 -0.125147 21.4815 0.595152 20.149Z" fill="#E4E4E4" />
                                </svg>
                                <svg width="22" height="24" viewBox="0 0 22 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0.595152 20.149L11 0.899994L21.4048 20.149C22.1251 21.4815 21.1602 23.1 19.6454 23.1H2.35457C0.839797 23.1 -0.125147 21.4815 0.595152 20.149Z" fill="#E4E4E4" />
                                </svg>
                            </div>
                            <div className="absolute right-0 mx-10">
                                <a className="text-xl">{difficulty}%</a>
                            </div>
                        </div>
                        <h2 className="mt-10 mx-5 text-2xl font-medium">Tags:</h2>
                        <hr className="mt-2 mx-5" />
                        <div className="mx-5 my-10 absolute bottom-0 flex flex-row gap-4">
                            <div className="flex justify-center items-center rounded-lg bg-[#232123] border h-[50px] w-[300px] cursor-pointer hover:bg-[#D63636] gap-3">
                                <svg width="23" height="28" viewBox="0 0 23 28" fill="#F9F9F9" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18.2727 10.0715L15.7741 10.0715L15.7741 2.21431C15.7741 1.35003 15.067 0.642883 14.2027 0.642883L7.91696 0.642883C7.05267 0.642883 6.34553 1.35003 6.34553 2.21431L6.34553 10.0715L3.84696 10.0715C2.44839 10.0715 1.74124 11.7686 2.73124 12.7586L9.9441 19.9715C10.557 20.5843 11.547 20.5843 12.1598 19.9715L19.3727 12.7586C20.3627 11.7686 19.6712 10.0715 18.2727 10.0715ZM0.0598145 25.7857C0.0598145 26.65 0.766957 27.3572 1.63124 27.3572L20.4884 27.3572C21.3527 27.3572 22.0598 26.65 22.0598 25.7857C22.0598 24.9215 21.3527 24.2143 20.4884 24.2143L1.63124 24.2143C0.766957 24.2143 0.0598145 24.9215 0.0598145 25.7857Z" />
                                </svg>
                                <a className="text-[#F9F9F9] text-2xl font-medium">Download</a>
                            </div>
                            <div className="flex justify-center items-center rounded-lg bg-[#F9F9F9] border-2 border-[#232123] h-[50px] w-[147px] cursor-pointer hover:bg-[#4F89E1] hover:border-[#4F89E1] group gap-3">
                                <svg className="group-hover:fill-[#F9F9F9]" width="27" height="28" viewBox="0 0 27 28" fill="#232123" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M16.1189 21.7673L8.73733 17.6604C8.02877 18.3779 7.12784 18.8653 6.14812 19.0612C5.1684 19.2572 4.15375 19.1528 3.23208 18.7613C2.31042 18.3698 1.523 17.7088 0.969106 16.8614C0.415209 16.0141 0.119629 15.0184 0.119629 14C0.119629 12.9816 0.415209 11.9859 0.969106 11.1386C1.523 10.2912 2.31042 9.63016 3.23208 9.23868C4.15375 8.8472 5.1684 8.74284 6.14812 8.93876C7.12784 9.13468 8.02877 9.62211 8.73733 10.3396L16.1189 6.2327C15.8658 5.02102 16.0486 3.75686 16.634 2.6714C17.2195 1.58595 18.1683 0.751723 19.3072 0.32129C20.446 -0.109143 21.6986 -0.107023 22.836 0.327263C23.9734 0.761548 24.9196 1.59898 25.5015 2.68641C26.0834 3.77384 26.2621 5.03861 26.005 6.24943C25.7479 7.46025 25.0722 8.5362 24.1013 9.28053C23.1305 10.0249 21.9294 10.3878 20.7178 10.3031C19.5062 10.2183 18.3649 9.69143 17.5028 8.81885L10.1212 12.9258C10.2684 13.634 10.2684 14.366 10.1212 15.0742L17.5028 19.1811C18.3649 18.3086 19.5062 17.7817 20.7178 17.697C21.9294 17.6122 23.1305 17.9751 24.1013 18.7195C25.0722 19.4638 25.7479 20.5398 26.005 21.7506C26.2621 22.9614 26.0834 24.2262 25.5015 25.3136C24.9196 26.401 23.9734 27.2385 22.836 27.6727C21.6986 28.107 20.446 28.1091 19.3072 27.6787C18.1683 27.2483 17.2195 26.4141 16.634 25.3286C16.0486 24.2431 15.8658 22.979 16.1189 21.7673Z" />
                                </svg>
                                <a className="text-[#232123] text-2xl font-medium group-hover:text-[#F9F9F9]">Share</a>
                            </div>
                            <div className="flex justify-center items-center rounded-lg bg-[#F9F9F9] border-2 border-[#232123] h-[50px] w-[147px] cursor-pointer hover:bg-[#1EB475] hover:border-[#1EB475] group gap-3">
                                <svg className="group-hover:fill-[#F9F9F9]" width="23" height="26" viewBox="0 0 23 26" fill="#232123" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M23 4.79005C23 5.57656 22.3565 6.22007 21.5699 6.22007H20.1399V7.65009C20.1399 8.4366 19.4964 9.08011 18.7099 9.08011C17.9234 9.08011 17.2799 8.4366 17.2799 7.65009V6.22007H15.8499C15.0634 6.22007 14.4199 5.57656 14.4199 4.79005C14.4199 4.00354 15.0634 3.36004 15.8499 3.36004H17.2799V1.93002C17.2799 1.14351 17.9234 0.5 18.7099 0.5C19.4964 0.5 20.1399 1.14351 20.1399 1.93002V3.36004H21.5699C22.3565 3.36004 23 4.00354 23 4.79005ZM20.1399 24.0667C20.1399 25.0963 19.096 25.7827 18.1522 25.3823L10.1298 21.9503L2.1074 25.3823C1.89019 25.4767 1.65285 25.5152 1.41694 25.4946C1.18102 25.4739 0.954016 25.3946 0.756535 25.2639C0.559054 25.1332 0.397359 24.9552 0.28614 24.7461C0.17492 24.5371 0.1177 24.3035 0.119679 24.0667V3.36004C0.119679 1.78702 1.40669 0.5 2.97971 0.5H12.9898C12.1207 1.66063 11.6249 3.05799 11.568 4.50685C11.5111 5.95571 11.8959 7.38765 12.6713 8.61285C13.4468 9.83805 14.5762 10.7987 15.91 11.3673C17.2439 11.936 18.719 12.0859 20.1399 11.7971V24.0667Z" />
                                </svg>
                                <a className="text-[#232123] text-2xl font-medium group-hover:text-[#F9F9F9]">Save</a>
                            </div>
                        </div>
                    </div>
                    <div className="relative m-auto pt-10 justify-center items-center flex flex-row gap-5">
                        <Image className="rounded-lg drop-shadow-[0_10px_8px_rgba(0,0,0,0.50)]" src="/images/ShowcasedImage-Test.png" width={203} height={154} />
                        <Image className="rounded-lg hover:border-[#F9F9F9] hover:border-4 hover:drop-shadow-[0_10px_8px_rgba(0,0,0,0.50)]" src="/images/screenshot2.png" width={203} height={154} />
                        <Image className="rounded-lg hover:border-[#F9F9F9] hover:border-4 hover:drop-shadow-[0_10px_8px_rgba(0,0,0,0.50)]" src="/images/screenshot3.png" width={203} height={154} />
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default GameDetails;
